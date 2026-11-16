/* Firebase 연결: 별도 빌드 없이 GitHub Pages에서 동작하는 Firebase Web SDK. */
const config = window.TripFirebaseConfig || {};
const configured = !!(config.apiKey && config.projectId && config.authDomain && config.appId);

if (configured) {
  const SDK = 'https://www.gstatic.com/firebasejs/13.3.0/';
  const [{initializeApp},{getAuth,onAuthStateChanged,signInWithEmailAndPassword,signOut},{getFirestore,doc,collection,getDoc,runTransaction,onSnapshot,writeBatch}] = await Promise.all([
    import(SDK+'firebase-app.js'),
    import(SDK+'firebase-auth.js'),
    import(SDK+'firebase-firestore.js')
  ]);
  const app=initializeApp(config);
  const auth=getAuth(app);
  const db=getFirestore(app);
  const tripId=window.TripFirebaseTripId || 'phuquoc-family-2026';
  const tripRef=doc(db,'trips',tripId);
  const TYPES=['plans','bookings','places','tasks','taskGroups'];
  const gate=document.getElementById('authGate');
  const form=document.getElementById('authForm');
  const errBox=document.getElementById('authError');
  const authNotice=document.getElementById('authNotice');
  const retry=document.getElementById('authRetry');
  const submit=document.getElementById('authSubmit');
  const jsonClone=(v)=>JSON.parse(JSON.stringify(v));
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

  async function login() {
    authNotice.textContent='부부 전용 여행 노트에 로그인해 주세요.';
    gate.hidden=false;
    retry.hidden=true;
    form.hidden=false;
    errBox.hidden=true;
    return new Promise((resolve)=>{
      const handler=async (event)=>{
        event.preventDefault();
        errBox.hidden=true;
        submit.disabled=true;submit.textContent='로그인 중...';
        try {
          const email=form.elements.email.value.trim();
          const password=form.elements.password.value;
          const result=await signInWithEmailAndPassword(auth,email,password);
          form.removeEventListener('submit',handler);
          form.reset(); gate.hidden=true; resolve(result.user);
        } catch (e) {
          errBox.textContent = e.code==='auth/invalid-credential'?'이메일 또는 비밀번호를 확인해 주세요.':'로그인할 수 없습니다: '+(e.code || e.message);
          errBox.hidden=false;
        } finally {submit.disabled=false;submit.textContent='로그인';}
      };
      form.addEventListener('submit',handler);
    });
  }
  async function activeUser() {
    const user=await new Promise((resolve,reject)=>{
      const unsub=onAuthStateChanged(auth,(u)=>{unsub();resolve(u);},reject);
    });
    return user || login();
  }
  class FirebaseTripStore {
    constructor(){
      this.data=null;this.listeners=new Set();this.snapUnsubs=[];this.persistent=true;
      this.isCloud=true;this.email='';this.commitQueue=Promise.resolve();this.initialized=false;
      this.parts={};this.currentTrip=null;this.emitTimer=null;
    }
    subscribe(fn){this.listeners.add(fn);return ()=>this.listeners.delete(fn);}
    read(){return jsonClone(this.data);}
    notify(){if(!this.data)return;const data=this.read();this.listeners.forEach(fn=>fn(data));}
    build(){
      if(!this.currentTrip||TYPES.some(k=>!this.parts[k]))return null;
      const t=this.currentTrip;
      const value={schemaVersion:1,trip:{title:t.title,startDate:t.startDate,endDate:t.endDate,datesAreExamples:!!t.datesAreExamples}};
      TYPES.forEach(k=>{value[k]=this.parts[k].map(jsonClone);});
      return window.TripStore.normalizeState(value);
    }
    renderIncoming(){
      if(this.emitTimer)clearTimeout(this.emitTimer);
      this.emitTimer=setTimeout(()=>{
        const state=this.build();
        if(state && window.TripStore.validState(state)){
          this.data=state;this.notify();
        }
      },65);
    }
    async init(){
      gate.hidden=false;
      authNotice.textContent='로그인 정보를 확인하고 있어요...';
      try {
        const user=await activeUser(); this.email=user.email||'';
        authNotice.textContent='부부 전용 여행 노트를 불러오고 있어요...';
        const trip=await getDoc(tripRef);
        if(!trip.exists() || !(trip.data().memberUids||[]).includes(user.uid))
          throw new Error('이 계정은 아직 여행 멤버로 등록되지 않았습니다. Firebase 여행 문서의 memberUids를 확인하세요.');
        // 첫 접속에 한해 예시 데이터 초기화. 둘이 동시에 열어도 트랜잭션으로 한 번만 초기화됩니다.
        await runTransaction(db, async tx=>{
          const existing=await tx.get(tripRef);
          if(!existing.exists())throw new Error('여행 문서를 찾지 못했습니다.');
          if(existing.data().seeded)return;
          const sample=window.TripStore.freshData();
          for(const type of TYPES){
            for(const item of sample[type]){
              const {id,...fields}=item;
              tx.set(doc(collection(tripRef,type),id),fields);
            }
          }
          tx.update(tripRef,{seeded:true});
        });
        const ready=new Set();
        await new Promise((resolve,reject)=>{
          const complete=(k)=>{
            ready.add(k);
            if(ready.size===TYPES.length+1){
              const data=this.build();
              if(!window.TripStore.validState(data))reject(new Error('공유 데이터 형식을 확인해 주세요.'));
              else {this.data=data;this.initialized=true;resolve();}
            }
          };
          const fail=(e)=>reject(e);
          this.snapUnsubs.push(onSnapshot(tripRef,(s)=>{
            if(!s.exists()){fail(new Error('여행 문서가 삭제되었습니다.'));return;}
            this.currentTrip=s.data();complete('trip');if(this.initialized)this.renderIncoming();
          },fail));
          for(const type of TYPES){
            const ref=collection(tripRef,type);
            this.snapUnsubs.push(onSnapshot(ref,(snapshot)=>{
              this.parts[type]=snapshot.docs.map(s=>({id:s.id,...s.data()}));
              complete(type);if(this.initialized)this.renderIncoming();
            },fail));
          }
        });
        gate.hidden=true;
        return this.read();
      }catch(e){
        gate.hidden=false;
        form.hidden=true;
        retry.hidden=false;
        authNotice.textContent='데이터를 열 수 없습니다: '+e.message;
        errBox.hidden=true;
        retry.onclick=async()=>{await signOut(auth);location.reload();};
        throw e;
      }
    }
    async save(raw){
      if(!this.initialized)throw new Error('공동 저장소에 아직 연결되지 않았습니다.');
      if(!window.TripStore.validState(raw))throw new Error('여행 데이터 형식이 올바르지 않습니다.');
      const next=window.TripStore.normalizeState(raw);
      const prev=this.read();
      const ops=[];
      for(const type of TYPES){
        const prevMap=new Map(prev[type].map(x=>[x.id,x]));
        const nextMap=new Map(next[type].map(x=>[x.id,x]));
        for(const [id,item] of nextMap){
          if(!same(item,prevMap.get(id))) {const {id:_,...fields}=item;ops.push({mode:'set',ref:doc(collection(tripRef,type),id),data:fields});}
        }
        for(const id of prevMap.keys())if(!nextMap.has(id))ops.push({mode:'delete',ref:doc(collection(tripRef,type),id)});
      }
      const prevTrip=prev.trip, nextTrip=next.trip;
      if(!same(prevTrip,nextTrip))ops.push({mode:'trip',ref:tripRef,data:{title:nextTrip.title,startDate:nextTrip.startDate,endDate:nextTrip.endDate,datesAreExamples:!!nextTrip.datesAreExamples}});
      if(ops.length>400)throw new Error('한 번에 변경한 항목이 너무 많습니다 (최대 400개).');
      if(!ops.length)return this.read();
      this.data=next;this.notify();
      this.commitQueue=this.commitQueue.catch(()=>{}).then(async()=>{
        const batch=writeBatch(db);
        for(const op of ops){
          if(op.mode==='set')batch.set(op.ref,op.data);
          else if(op.mode==='delete')batch.delete(op.ref);
          else batch.update(op.ref,op.data);
        }
        await batch.commit();
      });
      try{await this.commitQueue;return this.read();}
      catch(e){
        // SDK listener restores last server snapshot on failure.
        this.renderIncoming();
        throw new Error('공동 저장 실패: '+(e.code||e.message));
      }
    }
    async logout(){this.snapUnsubs.forEach(x=>x()); await signOut(auth);location.reload();}
  }
  window.TripStore.FirebaseTripStore=FirebaseTripStore;
}
