import './firebase/bridge.js';
/*
  푸꾸옥 가족여행 플래너 - 바닐라 JavaScript
  파이썬/서버/빌드 툴 없이 실행됩니다.
  현재 저장소: store.js의 LocalTripStore; 다른 아이폰과 자동 동기화되지 않음.
*/
(function () {
  'use strict';

  const ICONS = {
    home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    ticket:'<path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a3 3 0 0 0 0 6v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a3 3 0 0 0 0-6Z"/><path d="M13 5v2m0 4v2m0 4v2"/>',
    pin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    checks:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m7 12 3 3 7-7"/>',
    settings:'<path d="M12 3v2m0 14v2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M3 12h2m14 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
    right:'<path d="m9 18 6-6-6-6"/>',
    back:'<path d="m15 18-6-6 6-6"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
    plane:'<path d="M20 3 8 14l-5-1-2 2 7 3 3 5 2-2-1-5L23 4z"/>',
    bed:'<path d="M3 7v13m18-13v13M3 17h18M4 12h16v5H4zM5 10V7h6v3m2 0V7h6v3"/>',
    car:'<path d="m5 17-2 2v2m16-4 2 2v2M5 17h14l2-6-3-6H6l-3 6zM3 11h18M7 15h.01M17 15h.01"/>',
    food:'<path d="M4 3v8m4-8v8M4 7h4M6 11v10M17 3c-4 2-4 7 0 9v9m0-18v9"/>',
    coffee:'<path d="M3 8h14v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zm14 2h2a3 3 0 0 1 0 6h-2M8 2v3m5-3v3"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    waves:'<path d="M2 9c2 0 2 2 5 2s3-2 5-2 3 2 5 2 3-2 5-2M2 16c2 0 2 2 5 2s3-2 5-2 3 2 5 2 3-2 5-2"/>',
    compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6z"/>',
    edit:'<path d="M12 20h9M16 4l4 4-12 12H4v-4z"/>',
    trash:'<path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"/>',
    bookmark:'<path d="M5 3h14v19l-7-5-7 5z"/>',
    lock:'<rect x="4" y="10" width="16" height="12" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    heart:'<path d="M20.8 4.6a5.6 5.6 0 0 0-7.9 0L12 5.5l-.9-.9a5.6 5.6 0 1 0-7.9 7.9L12 21l8.8-8.5a5.6 5.6 0 0 0 0-7.9Z"/>',
    check:'<path d="m4 12 5 5L20 6"/>',
    external:'<path d="M14 3h7v7m0-7-9 9M20 14v6H4V4h6"/>',
    x:'<path d="M5 5l14 14M19 5 5 19"/>',
    download:'<path d="M12 3v13m-5-5 5 5 5-5M4 18v3h16v-3"/>',
    upload:'<path d="M12 17V4m-5 5 5-5 5 5M4 18v3h16v-3"/>',
    share:'<circle cx="18" cy="5" r="3"/><circle cx="5" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m7.7 10.6 7.7-4.2m-7.7 8 7.7 4.2"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
    shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    package:'<path d="m12 2 9 5-9 5-9-5zM3 7v10l9 5 9-5V7M12 12v10"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    open:'<path d="M5 12h14m-5-5 5 5-5 5"/>',
    sparkles:'<path d="m12 3 2.1 6.9L21 12l-6.9 2.1L12 21l-2.1-6.9L3 12l6.9-2.1z"/>',
    search:'<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>'
  };
  const PLAN_TYPES = {
    move:{label:'이동',icon:'car'}, stay:{label:'숙소',icon:'bed'}, food:{label:'식사',icon:'food'},
    activity:{label:'관광',icon:'compass'}, rest:{label:'휴식',icon:'sun'}
  };
  const BOOK_TYPES = {
    flight:{label:'항공권',icon:'plane'}, hotel:{label:'호텔',icon:'bed'},
    transport:{label:'교통',icon:'car'}, activity:{label:'액티비티',icon:'compass'}, other:{label:'기타',icon:'ticket'}
  };
  const PLACE_TYPES = {
    food:{label:'맛집',icon:'food'}, sight:{label:'관광',icon:'compass'}, cafe:{label:'카페',icon:'coffee'}, beach:{label:'해변',icon:'waves'}, other:{label:'기타',icon:'pin'}
  };
  const REGION = {north:'북부',central:'중부',south:'남부',unknown:'지역 미정'};
  const TASK_CATEGORIES = {
    before: {booking:'🚕 예약·교통',documents:'🛂 서류·보험',connectivity:'💳 통신·결제',final:'🏠 출발 직전',misc:'기타'},
    packing: {essentials:'🎒 필수품',adults:'👕 어른 짐',kids:'🧸 아이들 짐',health:'💊 건강·안전',devices:'🔌 전자기기',misc:'기타'},
    during: {arrival:'📍 현지 확인',misc:'기타'}
  };
  const OWNERS = {both:'함께',me:'나',spouse:'아내'};
  const TABS = [
    {id:'home',name:'홈',icon:'home'}, {id:'plans',name:'일정',icon:'calendar'},
    {id:'bookings',name:'예약',icon:'ticket'}, {id:'places',name:'장소',icon:'pin'},
    {id:'tasks',name:'준비물',icon:'checks'}
  ];

  const root = document.getElementById('app');
  const header = document.getElementById('appHeader');
  const nav = document.getElementById('bottomNav');
  const dialog = document.getElementById('editorDialog');
  const modal = document.getElementById('modalContent');
  const inputFile = document.getElementById('importFile');
  const toastElement = document.getElementById('toast');
  const store = window.TripStore.FirebaseTripStore ? new window.TripStore.FirebaseTripStore() : new window.TripStore.LocalTripStore();
  let state;
  let toastTimer;
  const ui = {tab:'home', selectedDate:null, placeFilter:'all', regionFilter:'all', taskGroup:'before', taskIncompleteOnly:false};
  function taskGroups() { return state.taskGroups; }
  function taskGroupOptions() { return Object.fromEntries(taskGroups().map((g)=>[g.id,g.title])); }
  function taskCategoryOptions(groupId) { return TASK_CATEGORIES[groupId] || {misc:'기타'}; }
  function ensureTaskGroupSelected() {
    if (!taskGroups().some((g)=>g.id===ui.taskGroup)) ui.taskGroup=taskGroups()[0].id;
  }

  function icon(name, extra='') {
    return `<svg aria-hidden="true" class="icon ${extra}" viewBox="0 0 24 24">${ICONS[name] || ICONS.info}</svg>`;
  }
  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function parseDate(iso) { return new Date(`${iso}T12:00:00`); }
  function isoDate(date) {
    return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
  }
  function todayISO() { return isoDate(new Date()); }
  function addDays(iso, days) { const d=parseDate(iso); d.setDate(d.getDate()+days); return isoDate(d); }
  function daysBetween(a,b) { return Math.round((parseDate(b)-parseDate(a))/86400000); }
  function dayLabel(iso, year=false) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '날짜 미정';
    return new Intl.DateTimeFormat('ko-KR', {year:year?'numeric':undefined, month:'long',day:'numeric',weekday:'short'}).format(parseDate(iso));
  }
  function shortDate(iso) { if (!iso) return '날짜 미정'; const d=parseDate(iso); return `${d.getMonth()+1}/${d.getDate()}`; }
  function dayDates() {
    const {startDate,endDate}=state.trip;
    const n=Math.max(1,Math.min(60,daysBetween(startDate,endDate)+1));
    return Array.from({length:n},(_,i)=>addDays(startDate,i));
  }
  function defaultSelectedDate() {
    const now=todayISO();
    return now<state.trip.startDate?state.trip.startDate:now>state.trip.endDate?state.trip.endDate:now;
  }
  function dateInTrip(date) { return date>=state.trip.startDate && date<=state.trip.endDate; }
  function setDateIfNeeded() { if (!ui.selectedDate || !dateInTrip(ui.selectedDate)) ui.selectedDate=defaultSelectedDate(); }
  function safeUrl(value) {
    const raw=String(value||'').trim();
    if (!raw) return '';
    const expanded = /^[\w.-]+\.[a-z]{2,}([/?#]|$)/i.test(raw)?'https://'+raw:raw;
    try { const u=new URL(expanded); return ['http:','https:'].includes(u.protocol)?u.href:''; } catch { return ''; }
  }
  function linkButton(url,label='열기',buttonClass='mini-action') {
    const target=safeUrl(url);
    return target?`<a class="${buttonClass}" href="${esc(target)}" target="_blank" rel="noopener noreferrer">${icon('external','tiny')}${esc(label)}</a>`:'';
  }
  function googleMapLink(query) {
    return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query+', Phu Quoc, Vietnam');
  }
  function uid() { return (window.crypto && crypto.randomUUID)?crypto.randomUUID():`entry-${Date.now()}-${Math.floor(Math.random()*1e6)}`; }
  function toast(message) {
    toastElement.textContent=message;
    toastElement.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>toastElement.classList.remove('show'),2800);
  }
  function sortsPlans(date) {
    return state.plans.filter((p)=>p.date===date).sort((a,b)=>(a.time||'99:99').localeCompare(b.time||'99:99'));
  }
  function bookingsForDate(date) {
    return state.bookings.filter((b)=>b.startDate<=date && (b.endDate||b.startDate)>=date);
  }
  // 예약은 정보 원본, 일정은 해당 예약을 참조하는 항목입니다. 기존 v4의 bookingId도 그대로 읽습니다.
  function linkedPlans(bookingId) { return state.plans.filter((p)=>p.bookingId===bookingId); }
  function agendaTemplates(booking) {
    if(booking.type==='hotel') {
      const items=[{role:'checkin',date:booking.startDate,time:booking.startTime||'',category:'stay',label:'체크인'}];
      if(booking.endDate && booking.endDate!==booking.startDate) items.push({role:'checkout',date:booking.endDate,time:booking.endTime||'',category:'stay',label:'체크아웃'});
      return items;
    }
    const map={flight:['move','출발'],transport:['move','이동'],activity:['activity','방문'],other:['activity','예약 일정']};
    const [category,label]=map[booking.type]||map.other;
    return [{role:'start',date:booking.startDate,time:booking.startTime||'',category,label}];
  }
  function planRoleMatches(plan,template,booking) {
    if(plan.autoBookingRole) return plan.autoBookingRole===template.role;
    if(template.role==='checkout') return plan.date===booking.endDate && /체크아웃|퇴실|check.?out/i.test(plan.title);
    if(template.role==='checkin') return plan.date===booking.startDate && !/체크아웃|퇴실|check.?out/i.test(plan.title);
    return plan.date===booking.startDate;
  }
  function missingAgendaTemplates(booking, plans) {
    const existing=plans.filter((p)=>p.bookingId===booking.id);
    return agendaTemplates(booking).filter((t)=>!existing.some((p)=>planRoleMatches(p,t,booking)));
  }
  function createAgendaForBooking(next,booking) {
    const missing=missingAgendaTemplates(booking,next.plans);
    let count=0;
    for(const template of missing){
      if(template.date<next.trip.startDate || template.date>next.trip.endDate) continue;
      next.plans.push({id:uid(),date:template.date,time:template.time,title:template.label,
        category:template.category,location:'',note:'',url:'',bookingId:booking.id,
        autoBookingRole:template.role});
      count++;
    }
    return count;
  }
  function bookingPlanTitle(plan,booking) {
    if(!booking || !plan.autoBookingRole) return plan.title;
    const template=agendaTemplates(booking).find((t)=>t.role===plan.autoBookingRole);
    if(plan.title && template && plan.title!==template.label) return plan.title;
    return `${booking.title} · ${template?.label||plan.title}`;
  }
  function syncAutoAgenda(next,booking,previous) {
    const before=previous||{};
    for(const p of next.plans.filter((plan)=>plan.bookingId===booking.id && plan.autoBookingRole)) {
      const template=agendaTemplates(booking).find((t)=>t.role===p.autoBookingRole);
      if(!template)continue;
      if(template.date) p.date=template.date;
      // 일정을 따로 수정한 시간은 유지하고, 예약에서 시간을 변경했을 때만 동기화합니다.
      const oldTime=p.autoBookingRole==='checkout'?(before.endTime||''):(before.startTime||'');
      const newTime=p.autoBookingRole==='checkout'?(booking.endTime||''):(booking.startTime||'');
      if(oldTime!==newTime) p.time=newTime;
    }
  }
  function dateStrip() {
    const names=['일','월','화','수','목','금','토'];
    return `<div class="date-strip" role="group" aria-label="여행 날짜 선택">${dayDates().map((date)=>{
      const d=parseDate(date),active=date===ui.selectedDate;
      return `<button type="button" class="date-item ${active?'active':''} ${date===todayISO()?'today':''}" data-action="select-date" data-date="${esc(date)}" aria-pressed="${active}"><span class="dow">${d.getMonth()+1}월 · ${names[d.getDay()]}</span><span class="day">${d.getDate()}</span></button>`;
    }).join('')}</div>`;
  }
  function emptyState(kind,text,action,label) {
    return `<div class="empty-state"><div class="empty-icon">${icon(kind,'big')}</div><strong>${esc(text)}</strong><p>${action==='plan'?'일정을 직접 추가하면 오늘 일정에서 바로 확인할 수 있습니다.':action==='booking'?'항공권·호텔의 예약 날짜와 링크를 저장할 수 있습니다.':action==='place'?'추천받은 식당이나 관광지를 저장하고 서로 비교해보세요.':'첫 번째 항목을 만들어 보세요.'}</p><button type="button" class="secondary-button" data-action="add" data-kind="${action}">${icon('plus','tiny')}${esc(label)}</button></div>`;
  }
  function planRow(plan, compact=false) {
    const cat=PLAN_TYPES[plan.category]||PLAN_TYPES.activity;
    const booking=plan.bookingId?state.bookings.find((b)=>b.id===plan.bookingId):null;
    const location=plan.location||booking?.location||'';
    const title=bookingPlanTitle(plan,booking);
    return `<div class="timeline-item"><div class="time-column">${esc(plan.time||'시간 미정')}</div><div class="timeline-card"><span class="category-icon ${esc(plan.category)}">${icon(cat.icon)}</span><div class="timeline-content"><h3>${esc(title)}</h3>${location?`<p>${icon('pin','tiny')} ${esc(location)}</p>`:''}${booking?`<div class="linked-booking">${icon('ticket','tiny')}<span>예약 연결 · ${esc(booking.title)}</span></div>`:''}${plan.note&&!compact?`<p>${esc(plan.note)}</p>`:''}<div class="mini-actions">${linkButton(plan.url,'일정 자료')}${booking?linkButton(booking.url,'예약 문서'):''}${location?linkButton(googleMapLink(location),'지도'):''}${booking?`<button type="button" class="mini-action" data-action="booking-detail" data-id="${esc(booking.id)}">${icon('ticket','tiny')}예약 상세</button>`:plan.category!=='food'&&plan.category!=='rest'?`<button type="button" class="mini-action" data-action="booking-from-plan" data-id="${esc(plan.id)}">${icon('ticket','tiny')}예약 만들기</button>`:''}<button type="button" class="mini-action" data-action="edit" data-kind="plan" data-id="${esc(plan.id)}">${icon('edit','tiny')}수정</button>${!compact?`<button type="button" class="mini-action red" data-action="delete" data-kind="plan" data-id="${esc(plan.id)}">${icon('trash','tiny')}삭제</button>`:''}</div></div></div></div>`;
  }
  function bookingRow(b,compact=false) {
    const type=BOOK_TYPES[b.type]||BOOK_TYPES.other;
    const dateStr=b.endDate&&b.endDate!==b.startDate?`${dayLabel(b.startDate)} ~ ${dayLabel(b.endDate)}`:dayLabel(b.startDate);
    const linked=linkedPlans(b.id),missing=missingAgendaTemplates(b,state.plans);
    return `<article class="booking-card card"><div class="booking-top"><div class="booking-main"><span class="category-icon ${b.type==='hotel'?'stay':''}">${icon(type.icon)}</span><div><span class="badge grey">${esc(type.label)}</span><h3 class="item-title" style="margin-top:6px">${esc(b.title)}</h3><div class="booking-meta">${esc(dateStr)}${b.location?`<div>${icon('pin','tiny')} ${esc(b.location)}</div>`:''}${b.reference?`<div>예약번호: <strong>${esc(b.reference)}</strong></div>`:''}${b.note&&!compact?`<div>${esc(b.note)}</div>`:''}</div>${linked.length?`<div class="linked-booking">${icon('check','tiny')} 일정 ${linked.length}개 연결됨</div>`:''}</div></div></div><div class="mini-actions" style="margin-left:47px">${linkButton(b.url,'예약 정보 열기')}${linked.length?`<button class="mini-action" data-action="show-booking-plans" data-id="${esc(b.id)}">${icon('calendar','tiny')}연결 일정</button>`:''}${missing.length?`<button class="mini-action" data-action="booking-to-plan" data-id="${esc(b.id)}">${icon('plus','tiny')}일정에 추가</button>`:''}<button class="mini-action" data-action="edit" data-kind="booking" data-id="${esc(b.id)}">${icon('edit','tiny')}수정</button>${!compact?`<button class="mini-action red" data-action="delete" data-kind="booking" data-id="${esc(b.id)}">${icon('trash','tiny')}삭제</button>`:''}</div></article>`;
  }
  function taskRow(task, compact=false) {
    const done=!!task.done;
    const url=task.url?safeUrl(task.url):'';
    return `<div class="task-row"><button type="button" class="task-check ${done?'done':''}" data-action="toggle-task" data-id="${esc(task.id)}" role="checkbox" aria-checked="${done}" aria-label="${esc(task.title)} 완료 상태 변경">${done?icon('check','tiny'):''}</button><div class="task-content"><strong class="${done?'done':''}">${esc(task.title)}</strong><p>${esc(OWNERS[task.owner]||'함께')}${task.note&&!compact?' · '+esc(task.note):''}</p>${url&&!compact?`<div class="task-links">${linkButton(url,'관련 링크 열기')}</div>`:''}</div><button type="button" class="task-edit" data-action="edit" data-kind="task" data-id="${esc(task.id)}" aria-label="${esc(task.title)} 수정">${icon('edit','tiny')}</button></div>`;
  }
  function progressBar(tasks) {
    const done=tasks.filter((t)=>t.done).length;
    const pct=tasks.length?Math.round(done/tasks.length*100):0;
    return `<div class="progressbar" aria-label="준비 완료 ${pct}퍼센트"><span style="width:${pct}%"></span></div>`;
  }
  function hero() {
    const until=daysBetween(todayISO(),state.trip.startDate);
    const status=until>0?`출발까지 D-${until}`:todayISO()<=state.trip.endDate?'여행 중 · 즐거운 하루!':'여행을 다녀왔어요';
    const range=`${shortDate(state.trip.startDate)} – ${shortDate(state.trip.endDate)}`;
    return `<section class="hero"><div class="eyebrow">FAMILY TRIP · PHU QUOC</div><h1>${esc(state.trip.title)}</h1><p>베트남 · ${esc(range)} ${state.trip.datesAreExamples?'(임시 날짜)':''}</p><div class="hero-status">${icon('sun','tiny')}${esc(status)}</div><div class="hero-art" aria-hidden="true"><div class="sun"></div><div class="island"></div><div class="island second"></div><svg class="tree" viewBox="0 0 85 93"><path d="M40 92 45 31" stroke="#176359" stroke-width="7" stroke-linecap="round"/><path d="M45 31Q21 7 5 36M45 31Q56 1 80 13M45 31Q70 27 84 49M45 31Q16 12 28 1" stroke="#176359" stroke-width="7" fill="none" stroke-linecap="round"/></svg></div></section>`;
  }
  function privacyNote() {
    return store.isCloud?`<div class="privacy-note">${icon('shield','tiny')}<span><strong>가족 공유 중</strong> · 로그인한 부부 계정의 일정과 준비물은 실시간으로 동기화됩니다.</span></div>`:`<div class="privacy-note">${icon('info','tiny')}<span><strong>로컬 모드:</strong> Firebase 설정 전이므로 현재 내용은 이 기기에만 저장됩니다.</span></div>`;
  }
  function renderHome() {
    const plans=sortsPlans(ui.selectedDate);
    const bookings=bookingsForDate(ui.selectedDate);
    const undone=state.tasks.filter((t)=>!t.done);
    let previewText='선택한 날짜의 일정';
    if(todayISO()<state.trip.startDate) previewText='여행 전 · 일정 미리보기';
    else if(todayISO()>state.trip.endDate) previewText='여행 종료 · 일정 다시보기';
    else if(ui.selectedDate===todayISO()) previewText='여행 중 · 오늘 일정';
    return `${hero()}${privacyNote()}
      <section class="section"><div class="section-head"><div><h2>오늘의 일정 <span class="badge sand">${esc(previewText)}</span></h2><p>${esc(dayLabel(ui.selectedDate,true))}</p></div><button class="text-button" data-action="tab" data-tab="plans">전체 일정 ${icon('right','tiny')}</button></div>${dateStrip()}<div class="preview-note">${icon('clock','tiny')}날짜를 누르면 해당 날짜의 일정과 예약을 확인할 수 있어요.</div>${plans.length?`<div class="timeline">${plans.slice(0,4).map((p)=>planRow(p,true)).join('')}</div>${plans.length>4?`<button class="text-button" data-action="tab" data-tab="plans" style="margin-top:10px">나머지 일정 ${plans.length-4}개 더 보기 ${icon('right','tiny')}</button>`:''}`:emptyState('calendar','아직 등록된 일정이 없어요','plan','이날 일정 추가')}</section>
      <section class="section"><div class="section-head"><div><h2>바로가기</h2><p>여행 중 자주 쓰는 메뉴</p></div></div><div class="quick-grid"><button type="button" class="quick-card" data-action="tab" data-tab="bookings"><span class="quick-icon">${icon('plane')}</span><strong>예약·서류</strong><small>항공 · 호텔 링크</small></button><button type="button" class="quick-card" data-action="tab" data-tab="places"><span class="quick-icon">${icon('pin')}</span><strong>맛집·장소</strong><small>지도 바로 열기</small></button><button type="button" class="quick-card" data-action="tab" data-tab="tasks"><span class="quick-icon">${icon('checks')}</span><strong>준비물</strong><small>할 일 · 짐 체크</small></button></div></section>
      <section class="section"><div class="section-head"><div><h2>이날 필요한 예약</h2><p>호텔·항공·액티비티 바로 확인</p></div><button class="text-button" data-action="add" data-kind="booking">추가 ${icon('plus','tiny')}</button></div>${bookings.length?bookings.map((b)=>bookingRow(b,true)).join(''):`<div class="card pad"><p class="hint-line" style="margin:0 0 10px">아직 이 날짜에 연결된 예약이 없어요. 항공편 또는 숙소를 등록해보세요.</p><button class="secondary-button" data-action="add" data-kind="booking">${icon('plus','tiny')}예약 등록</button></div>`}</section>
      <section class="section"><div class="section-head"><div><h2>남은 준비</h2><p>${undone.length}개 남음 · 총 ${state.tasks.length}개</p></div><button class="text-button" data-action="tab" data-tab="tasks">전체 보기 ${icon('right','tiny')}</button></div><div class="card"><div style="padding:16px 15px 3px">${progressBar(state.tasks)}</div>${undone.length?undone.slice(0,3).map((t)=>taskRow(t,true)).join(''):`<div class="card pad"><p class="hint-line">등록된 준비가 모두 완료되었습니다 🎉</p></div>`}</div></section>
    `;
  }
  function renderPlans() {
    const plans=sortsPlans(ui.selectedDate);
    const grouped=state.plans.length;
    return `<header class="page-heading"><h1>여행 일정</h1><p>예약을 한 번 등록하면 일정과 연결해 중복 입력을 줄일 수 있어요.</p></header><div class="section-head"><div><h2>${esc(dayLabel(ui.selectedDate,true))}</h2><p>등록된 일정 ${plans.length}개 · 전체 ${grouped}개</p></div><button class="text-button" data-action="add" data-kind="plan">${icon('plus','tiny')}일정 추가</button></div>${dateStrip()}<section class="section">${plans.length?`<div class="timeline">${plans.map((p)=>planRow(p,false)).join('')}</div>`:emptyState('calendar','이날 일정이 비어 있어요','plan','새 일정 추가')}</section><div class="tip-card">${icon('info')}<p><strong>팁:</strong> 기존 일정의 <b>예약 만들기</b>를 누르면 해당 내용으로 예약을 등록할 수 있어요. 예약을 먼저 만들면 일정 자동 추가도 가능합니다.</p></div>${fab('plan')}`;
  }
  function renderBookings() {
    const sorted=[...state.bookings].sort((a,b)=>a.startDate.localeCompare(b.startDate));
    return `<header class="page-heading"><h1>예약 · 중요 자료</h1><p>예약을 한 번만 등록해 일정과 연결하세요. 호텔 체크인·체크아웃도 자동 등록할 수 있어요.</p></header><div class="tip-card">${icon('shield')}<p>실제 항공권 원본은 본인 계정에 접근 권한이 설정된 드라이브 등에 저장하고, 여기에는 <strong>열람 링크</strong>를 등록하세요. 문서 자체의 공유 권한도 반드시 확인하세요.</p></div><section class="section">${sorted.length?sorted.map((b)=>bookingRow(b)).join(''):emptyState('ticket','등록된 예약이 아직 없어요','booking','항공·호텔 예약 추가')}</section>${fab('booking')}`;
  }
  function renderPlaceCard(place) {
    const cat=PLACE_TYPES[place.type]||PLACE_TYPES.other;
    const mapUrl=place.mapUrl||googleMapLink(place.title);
    return `<article class="place-card card"><div class="place-head"><span class="category-icon ${place.type==='food'?'food':''}">${icon(cat.icon)}</span><div class="place-content"><h3 class="item-title">${esc(place.title)}</h3><div class="place-tags"><span class="badge grey">${esc(cat.label)}</span><span class="badge grey">${esc(REGION[place.region]||'지역 미정')}</span></div>${place.note?`<p class="item-sub">${esc(place.note)}</p>`:''}</div><button class="card-action ${place.liked?'fav':''}" type="button" data-action="favorite" data-id="${esc(place.id)}" aria-label="${esc(place.title)} 찜하기" aria-pressed="${!!place.liked}">${icon('heart','big')}</button></div><div class="mini-actions" style="margin-left:47px">${linkButton(mapUrl,'지도')}${linkButton(place.url,'정보 링크')}<button class="mini-action" data-action="place-to-plan" data-id="${esc(place.id)}">${icon('plus','tiny')}일정에 추가</button><button class="mini-action" data-action="edit" data-kind="place" data-id="${esc(place.id)}">${icon('edit','tiny')}수정</button><button class="mini-action red" data-action="delete" data-kind="place" data-id="${esc(place.id)}">${icon('trash','tiny')}삭제</button></div></article>`;
  }
  function renderPlaces() {
    const filters=[{id:'all',name:'전체'},...Object.entries(PLACE_TYPES).map(([id,x])=>({id,name:x.label}))];
    const regionFilters=[{id:'all',name:'모든 지역'},...Object.entries(REGION).map(([id,name])=>({id,name}))];
    const places=state.places.filter((p)=>(ui.placeFilter==='all'||p.type===ui.placeFilter)&&(ui.regionFilter==='all'||p.region===ui.regionFilter)).sort((a,b)=>Number(!!b.liked)-Number(!!a.liked));
    return `<header class="page-heading"><h1>맛집 · 가볼 곳</h1><p>후보를 모아두고 마음에 드는 장소를 일정에 넣어보세요.</p></header><div class="filter-scroll" role="group" aria-label="장소 분류">${filters.map((f)=>`<button class="filter-chip ${ui.placeFilter===f.id?'active':''}" data-action="place-filter" data-filter="${esc(f.id)}">${esc(f.name)}</button>`).join('')}</div><div class="filter-scroll" role="group" aria-label="지역 선택">${regionFilters.map((f)=>`<button class="filter-chip ${ui.regionFilter===f.id?'active':''}" data-action="region-filter" data-filter="${esc(f.id)}">${esc(f.name)}</button>`).join('')}</div><section class="section" style="margin-top:13px">${places.length?places.map(renderPlaceCard).join(''):state.places.length?`<div class="empty-state"><strong>조건에 맞는 장소가 없어요.</strong><p>필터를 바꾸거나 장소를 추가해보세요.</p><button class="secondary-button" data-action="reset-filter">전체 보기</button></div>`:emptyState('pin','저장한 장소가 없어요','place','첫 장소 추가')}</section>${fab('place')}`;
  }
  function renderTasks() {
    ensureTaskGroupSelected();
    const allDone=state.tasks.filter((t)=>t.done).length;
    const group=ui.taskGroup;
    const groupTasks=state.tasks.filter((t)=>t.group===group);
    const groupDone=groupTasks.filter((t)=>t.done).length;
    const categories=taskCategoryOptions(group);
    const needTemplates=(window.TripRecommendedTasks||[]).some((t)=>taskGroups().some((g)=>g.id===t.group) && !state.tasks.some((s)=>s.id===t.id));
    const taskTabs=taskGroups().map(({id,title:label})=>{
      const items=state.tasks.filter((t)=>t.group===id), done=items.filter((t)=>t.done).length;
      return `<button type="button" class="prep-tab ${id===group?'active':''}" data-action="task-group" data-group="${esc(id)}" aria-pressed="${id===group}"><span>${esc(label)}</span><small>${done}/${items.length}</small></button>`;
    }).join('');
    const groups=Object.entries(categories).map(([category,label])=>{
      const all=groupTasks.filter((t)=>(t.category||'misc')===category).sort((a,b)=>Number(a.done)-Number(b.done));
      if(!all.length)return '';
      const shown=ui.taskIncompleteOnly?all.filter((t)=>!t.done):all;
      return `<section class="task-group"><div class="task-group-header"><strong>${esc(label)}</strong><small>${all.filter((t)=>t.done).length}/${all.length} 완료</small></div><div class="card">${shown.length?shown.map((t)=>taskRow(t)).join(''):`<div class="task-empty">이 분류는 모두 완료했어요 ✓</div>`}</div></section>`;
    }).join('');
    return `<header class="page-heading"><h1>여행 준비물</h1><p>출발 전에 할 일과 캐리어에 챙길 짐을 나눠 확인하세요.</p></header>
      <div class="prep-tab-toolbar"><strong>체크리스트 탭</strong><div class="prep-tab-actions"><button type="button" class="mini-action" data-action="add-task-group">${icon('plus','tiny')}새 탭</button><button type="button" class="mini-action" data-action="manage-task-groups">${icon('edit','tiny')}탭 관리</button></div></div>
      <div class="prep-tabs" role="group" aria-label="준비물 종류 선택">${taskTabs}</div>
      <div class="card pad prep-progress"><div class="item-row" style="align-items:center"><strong>${esc(taskGroups().find((g)=>g.id===group)?.title||'준비물')} 진행률</strong><span class="badge">${groupDone} / ${groupTasks.length} 완료</span></div><div style="margin-top:13px">${progressBar(groupTasks)}</div><p>전체 준비 ${allDone}/${state.tasks.length}개 완료</p></div>
      <div class="prep-controls"><button type="button" class="filter-chip ${ui.taskIncompleteOnly?'active':''}" data-action="task-filter" aria-pressed="${ui.taskIncompleteOnly}">${icon('checks','tiny')}미완료만 보기</button><button type="button" class="secondary-button prep-add" data-action="add" data-kind="task">${icon('plus','tiny')}항목 추가</button></div>
      ${needTemplates?`<div class="tip-card prep-template">${icon('package')}<p>기존에 저장한 여행 정보는 그대로 두고, 추천 출발 준비·짐 목록을 추가할 수 있어요.<br><button type="button" class="text-button" data-action="install-checklist">추천 체크리스트에 없는 항목 추가 ${icon('right','tiny')}</button></p></div>`:''}
      ${groups || '<div class="empty-state"><strong>아직 등록된 항목이 없어요.</strong><p>항목 추가 버튼을 눌러 시작하세요.</p></div>'}
      ${fab('task')}`;
  }
  function fab(kind) { return `<button class="fab" data-action="add" data-kind="${esc(kind)}" title="새 항목 추가" aria-label="새 항목 추가">${icon('plus','big')}</button>`; }
  function render() {
    if (!state) return;
    setDateIfNeeded();
    header.innerHTML=`<div class="brand"><span class="brand-logo" aria-hidden="true">🌴</span><div style="min-width:0"><strong>${esc(state.trip.title)}</strong><small>OUR LITTLE GETAWAY</small></div></div><button type="button" class="round-button" data-action="settings" aria-label="여행 설정">${icon('settings')}</button>`;
    nav.innerHTML=TABS.map((tab)=>`<button class="nav-item ${ui.tab===tab.id?'active':''}" type="button" data-action="tab" data-tab="${esc(tab.id)}" aria-current="${ui.tab===tab.id?'page':'false'}">${icon(tab.icon)}<span>${tab.name}</span></button>`).join('');
    const screens={home:renderHome,plans:renderPlans,bookings:renderBookings,places:renderPlaces,tasks:renderTasks};
    root.innerHTML=screens[ui.tab]();
    const activeChip=root.querySelector('.date-item.active');
    if(activeChip) activeChip.scrollIntoView({behavior:'instant',block:'nearest',inline:'center'});
  }
  function switchTab(tab) {
    if (!TABS.some((t)=>t.id===tab)) return;
    ui.tab=tab;
    render();
    window.scrollTo({top:0,behavior:'instant'});
  }
  async function mutate(fn,message) {
    const next=store.read();
    fn(next);
    try { await store.save(next); if(message) toast(message); }
    catch(err) { toast('저장 실패: '+err.message); }
  }
  function options(dict,selected) {
    return Object.entries(dict).map(([value,label])=>{
      const name=(typeof label==='object')?label.label:label;
      return `<option value="${esc(value)}" ${String(selected)===value?'selected':''}>${esc(name)}</option>`;
    }).join('');
  }
  function textField(label,name,value='',opts={}) {
    const type=opts.type||'text';
    const req=opts.required?'required':'';
    const placeholder=opts.placeholder?`placeholder="${esc(opts.placeholder)}"`:'';
    const max=opts.maxLength?`maxlength="${Number(opts.maxLength)}"`:'';
    return `<div class="field"><label for="f_${esc(name)}">${esc(label)}</label><input id="f_${esc(name)}" name="${esc(name)}" type="${esc(type)}" value="${esc(value)}" ${req} ${placeholder} ${max}></div>`;
  }
  function selectField(label,name,dict,selected) {
    return `<div class="field"><label for="f_${esc(name)}">${esc(label)}</label><select id="f_${esc(name)}" name="${esc(name)}">${options(dict,selected)}</select></div>`;
  }
  function areaField(label,name,value='',placeholder='') {
    return `<div class="field"><label for="f_${esc(name)}">${esc(label)}</label><textarea id="f_${esc(name)}" name="${esc(name)}" placeholder="${esc(placeholder)}" maxlength="2000">${esc(value)}</textarea></div>`;
  }
  function formFrame(title,inner,kind,id) {
    return `<div class="modal-head"><h2>${esc(title)}</h2><button class="round-button" type="button" data-action="close" aria-label="닫기">${icon('x')}</button></div><form class="modal-body" data-editor="${esc(kind)}" data-id="${esc(id||'')}">${inner}<div class="form-footer">${id?`<button type="button" class="secondary-button" data-action="${kind==='taskGroup'?'delete-task-group':'delete'}" data-kind="${esc(kind)}" data-id="${esc(id)}" style="margin-right:auto;color:#b5625d">${icon('trash','tiny')}삭제</button>`:''}<button type="button" class="secondary-button" data-action="close">취소</button><button type="submit" class="primary-button">${icon('check','tiny')}저장</button></div></form>`;
  }
  function editor(kind,id,defaults={}) {
    const dict={plan:'plans',booking:'bookings',place:'places',task:'tasks'};
    const src=id?(kind==='taskGroup'?taskGroups().find((g)=>g.id===id):(dict[kind]?state[dict[kind]].find((x)=>x.id===id):null)):null;
    const item=Object.assign({},src||{},defaults||{});
    let html='';
    if(kind==='plan') {
      const bookOptions={'':'연결하지 않음',...Object.fromEntries(state.bookings.map((b)=>[b.id,b.title]))};
      html=formFrame(id?'일정 수정':'일정 추가',
        textField('일정 이름','title',item.title||'',{required:true,placeholder:'예: 해변 산책',maxLength:100})+
        `<div class="field-grid">${textField('날짜','date',item.date||ui.selectedDate,{type:'date',required:true})}${textField('시간 (선택)','time',item.time||'',{type:'time'})}</div>`+
        selectField('분류','category',PLAN_TYPES,item.category||'activity')+
        textField('장소','location',item.location||'',{placeholder:'예: 푸꾸옥 국제공항'})+
        selectField('관련 예약','bookingId',bookOptions,item.bookingId||'')+
        textField('자료 링크 (선택)','url',item.url||'',{type:'url',placeholder:'https://...'})+
        areaField('메모','note',item.note||'','이동 방법, 아이들 휴식 등'),kind,id);
    } else if(kind==='booking') {
      const available=state.plans.filter((p)=>!p.bookingId || p.bookingId===id);
      const sourcePlan=item.originPlanId?state.plans.find((p)=>p.id===item.originPlanId):null;
      const defaultMode=sourcePlan?'existing':id?'none':'auto';
      const planOpts={'':'연결할 일정 선택',...Object.fromEntries(available.map((p)=>[p.id,`${dayLabel(p.date)} · ${p.title}`]))};
      html=formFrame(id?'예약 수정':'예약 추가',
        selectField('예약 종류','type',BOOK_TYPES,item.type||'flight')+
        textField('예약 이름','title',item.title||'',{required:true,placeholder:'예: ○○ 리조트 / 출국 항공편',maxLength:100})+
        `<div class="field-grid">${textField('시작 날짜','startDate',item.startDate||ui.selectedDate,{type:'date',required:true})}${textField('종료 날짜 (선택)','endDate',item.endDate||'',{type:'date'})}</div>`+
        `<div class="field-grid">${textField('시작 시각 (선택)','startTime',item.startTime||'',{type:'time'})}${textField('종료 시각 (선택)','endTime',item.endTime||'',{type:'time'})}</div>`+
        textField('장소 (선택)','location',item.location||'',{placeholder:'예: ○○ 리조트, 푸꾸옥'})+
        textField('예약번호 (선택)','reference',item.reference||'',{placeholder:'예약 확인 번호'})+
        textField('예약 확인 링크 (선택)','url',item.url||'',{type:'url',placeholder:'https://...'})+
        areaField('참고 메모','note',item.note||'','체크인·체크아웃, 수하물 등')+
        `<div class="booking-connect"><strong>${icon('calendar','tiny')} 일정과 연결하기</strong><p>예약정보가 원본이므로 일정에 다시 입력하지 않아도 됩니다. <b>자동 등록</b>은 호텔이면 체크인·체크아웃, 다른 예약이면 시작 일정을 만듭니다.</p>`+
        selectField('연결 방법','scheduleMode',{'auto':'일정 자동 추가 (추천)','existing':'기존 일정 하나와 연결','none':'예약만 저장'},defaultMode)+
        selectField('기존 일정 선택','existingPlanId',planOpts,sourcePlan?.id||'')+
        `<p class="hint-line">기존 일정을 선택하려면 위 연결 방법을 '기존 일정 하나와 연결'로 변경하세요. 이미 연결된 다른 일정은 유지됩니다. 여행 기간 밖 예약은 자동 일정이 생성되지 않습니다.</p></div>`,kind,id);
    } else if(kind==='place') {
      html=formFrame(id?'장소 수정':'장소 추가',
        textField('장소 이름','title',item.title||'',{required:true,placeholder:'예: 가보고 싶은 식당',maxLength:100})+
        `<div class="field-grid">${selectField('유형','type',PLACE_TYPES,item.type||'food')}${selectField('지역','region',REGION,item.region||'unknown')}</div>`+
        textField('정보 링크 (선택)','url',item.url||'',{type:'url',placeholder:'https://...'})+
        textField('지도 링크 (선택)','mapUrl',item.mapUrl||'',{type:'url',placeholder:'비우면 자동으로 구글 지도 검색'})+
        areaField('메모·추천 이유','note',item.note||'','추천 메뉴, 아이들과 방문 가능 여부 등')+
        `<label class="hint-line"><input type="checkbox" name="liked" ${item.liked?'checked':''}> 가고 싶은 장소로 찜하기</label>`,kind,id);
    } else if(kind==='task') {
      const group=item.group||ui.taskGroup||'before';
      const categoryOptions=taskCategoryOptions(group);
      html=formFrame(id?'준비 항목 수정':'준비 항목 추가',
        textField('준비 항목','title',item.title||'',{required:true,placeholder:'예: 아이들 수영복 챙기기',maxLength:130})+
        `<div class="field-grid">${selectField('구분','group',taskGroupOptions(),group)}${selectField('담당','owner',OWNERS,item.owner||'both')}</div>`+
        selectField('세부 분류','category',categoryOptions,item.category||'misc')+
        textField('관련 링크 (선택)','url',item.url||'',{type:'url',placeholder:'https://...'})+
        areaField('메모','note',item.note||'')+
        `<label class="hint-line"><input type="checkbox" name="done" ${item.done?'checked':''}> 완료한 항목</label>`,kind,id);
    } else if(kind==='taskGroup') {
      html=formFrame(id?'탭 이름 변경':'새 체크리스트 탭',
        textField('탭 이름','title',item.title||'',{required:true,placeholder:'예: 아이들 준비물, 장보기',maxLength:25})+
        `<p class="hint-line">탭을 만들면 준비물을 추가하거나 기존 항목을 옮길 수 있어요.</p>`,kind,id);
    }
    if(!html) return;
    modal.innerHTML=html;
    if(!dialog.open)dialog.showModal();
  }
  function manageTaskGroups() {
    const rows=taskGroups().map((group)=>{
      const count=state.tasks.filter((t)=>t.group===group.id).length;
      return `<div class="group-manager-row"><div class="group-manager-label"><strong>${esc(group.title)}</strong><small>${count}개 항목</small></div><div class="group-manager-buttons"><button type="button" class="mini-action" data-action="edit-task-group" data-id="${esc(group.id)}">${icon('edit','tiny')}이름 변경</button><button type="button" class="mini-action red" data-action="delete-task-group" data-id="${esc(group.id)}" ${taskGroups().length<=1?'disabled':''}>${icon('trash','tiny')}삭제</button></div></div>`;
    }).join('');
    modal.innerHTML=`<div class="modal-head"><h2>준비물 탭 관리</h2><button class="round-button" type="button" data-action="close" aria-label="닫기">${icon('x')}</button></div><div class="modal-body"><p class="modal-note">탭 이름을 자유롭게 바꾸거나 새 탭을 만들 수 있어요. 탭을 삭제할 때는 그 안의 준비물을 다른 탭으로 옮길 수 있습니다.</p><div class="group-manager-list">${rows}</div><button type="button" class="secondary-button group-new-button" data-action="add-task-group">${icon('plus','tiny')}새 탭 추가</button></div>`;
    if(!dialog.open)dialog.showModal();
  }
  function openTaskGroupDelete(id) {
    const group=taskGroups().find((g)=>g.id===id);
    if(!group)return;
    if(taskGroups().length<=1){toast('마지막 탭은 삭제할 수 없습니다.');return;}
    const count=state.tasks.filter((t)=>t.group===id).length;
    const other=taskGroups().filter((g)=>g.id!==id);
    const select=count?selectField('준비물을 옮길 탭','moveTo',Object.fromEntries(other.map((g)=>[g.id,g.title])),other[0].id):'';
    modal.innerHTML=`<div class="modal-head"><h2>탭 삭제</h2><button class="round-button" type="button" data-action="close" aria-label="닫기">${icon('x')}</button></div><div class="modal-body"><div class="modal-note"><strong>${esc(group.title)}</strong> 탭을 삭제하시겠어요?<br>${count?`체크리스트 ${count}개가 들어 있어요. 다른 탭으로 이동하면 체크 상태와 메모가 유지됩니다.`:'이 탭에는 준비물이 없어요.'}</div>${select}<div class="group-delete-options"><button type="button" class="primary-button" data-action="confirm-delete-task-group" data-strategy="move" data-id="${esc(id)}">${icon('check','tiny')}${count?'항목 옮기고 탭 삭제':'빈 탭 삭제'}</button>${count?`<button type="button" class="secondary-button danger-button" data-action="confirm-delete-task-group" data-strategy="delete" data-id="${esc(id)}">${icon('trash','tiny')}탭과 항목 모두 삭제</button>`:''}<button type="button" class="secondary-button" data-action="manage-task-groups">취소 · 탭 관리로</button></div></div>`;
    if(!dialog.open)dialog.showModal();
  }
  async function confirmTaskGroupDelete(id,strategy) {
    const group=taskGroups().find((g)=>g.id===id);
    if(!group || taskGroups().length<=1)return;
    const tasks=state.tasks.filter((t)=>t.group===id);
    const other=taskGroups().filter((g)=>g.id!==id);
    const target=tasks.length&&strategy==='move'?modal.querySelector('select[name="moveTo"]')?.value:other[0].id;
    if(!other.some((g)=>g.id===target)){toast('이동할 탭을 선택해주세요.');return;}
    if(strategy==='delete' && tasks.length && !window.confirm(`'${group.title}' 탭과 준비물 ${tasks.length}개를 영구 삭제할까요? 완료 체크와 메모도 삭제됩니다.`))return;
    ui.taskGroup=target;
    await mutate((next)=>{
      if(strategy==='delete')next.tasks=next.tasks.filter((t)=>t.group!==id);
      else next.tasks.forEach((t)=>{if(t.group===id){t.group=target;t.category='misc';}});
      next.taskGroups=next.taskGroups.filter((g)=>g.id!==id);
    },'탭을 삭제했습니다.');
    if(dialog.open)dialog.close();
  }
  function settings() {
    const trip=state.trip;
    modal.innerHTML=`<div class="modal-head"><h2>여행 설정</h2><button class="round-button" type="button" data-action="close" aria-label="닫기">${icon('x')}</button></div><div class="modal-body"><div class="modal-note">${icon('info','tiny')} 여행 기간은 <strong>예시 날짜</strong>로 입력되어 있습니다. 실제 여행 날짜로 변경해 주세요.</div><form data-editor="trip">${textField('여행 이름','title',trip.title,{required:true,maxLength:60})}<div class="field-grid">${textField('출발 날짜','startDate',trip.startDate,{type:'date',required:true})}${textField('귀국 날짜','endDate',trip.endDate,{type:'date',required:true})}</div><label class="hint-line"><input type="checkbox" name="shiftPlans" checked> 기존 일정을 변경된 출발 날짜만큼 함께 이동</label><div class="form-footer"><button type="submit" class="primary-button">${icon('check','tiny')}여행 설정 저장</button></div></form><div class="soft-divider"></div><div class="setting-block"><strong>데이터 보관 · 백업</strong><p>${store.isCloud?'현재 데이터는 Firebase에서 부부에게 공동 저장됩니다. 별도 JSON 백업도 권장합니다.':'현재 데이터는 이 기기의 브라우저에만 저장됩니다. JSON 백업을 보관하세요.'}</p><div class="button-row"><button class="secondary-button" data-action="export">${icon('download','tiny')}백업 내보내기</button><button class="secondary-button" data-action="import">${icon('upload','tiny')}백업 불러오기</button></div></div><div class="setting-block"><strong>공유 · 공동 편집</strong><p>${store.isCloud?'부부 각자 계정으로 로그인하면 동일한 일정과 체크 상태를 볼 수 있습니다. 다른 계정은 보안 규칙으로 차단됩니다.':'Firebase 설정이 아직 없으므로 링크를 전달해도 상대방에게 입력 데이터는 보이지 않습니다.'}</p><div class="button-row"><button class="secondary-button" data-action="share">${icon('share','tiny')}앱 링크 공유</button></div></div><div class="setting-block"><strong>예시 데이터 초기화</strong><p>${store.isCloud?'주의: 부부가 공동 사용하는 데이터 전체가 삭제되고 예시 데이터로 바뀝니다.':'현재 기기의 저장 항목을 지우고 처음 예시 상태로 되돌립니다.'}</p><button class="secondary-button" data-action="reset" style="color:#a85851">${icon('trash','tiny')}전체 초기화</button></div>${store.isCloud?`<div class="setting-block"><strong>가족 계정</strong><p>로그인: ${esc(store.email||'')}</p><button type="button" class="secondary-button" data-action="logout">로그아웃</button></div>`:''}</div>`;
    dialog.showModal();
  }
  async function saveForm(form) {
    const kind=form.dataset.editor;
    const id=form.dataset.id||'';
    const f=new FormData(form);
    const get=(k)=>String(f.get(k)||'').trim();
    const urlKeys=['url','mapUrl'];
    for (const key of urlKeys) {
      const v=get(key);
      if(v&&!safeUrl(v)) { toast('링크는 https:// 또는 http:// 주소만 사용할 수 있습니다.'); return; }
    }
    if (kind==='trip') {
      const oldStart=state.trip.startDate,startDate=get('startDate'),endDate=get('endDate');
      const diff=daysBetween(startDate,endDate);
      if(diff<0 || diff>59 || !Number.isFinite(diff)) {toast('여행 기간은 1~60일로 설정해주세요.');return;}
      await mutate((next)=>{
        next.trip.title=get('title'); next.trip.startDate=startDate; next.trip.endDate=endDate; next.trip.datesAreExamples=false;
        if(f.has('shiftPlans')) {
          const delta=daysBetween(oldStart,startDate);
          next.plans.forEach((plan)=>{ plan.date=addDays(plan.date,delta); });
        }
      },'여행 정보가 저장되었습니다.');
      ui.selectedDate=defaultSelectedDate();
      render();
      dialog.close();
      return;
    }
    if(kind==='taskGroup') {
      const title=get('title');
      if(!title || title.length>25){toast('탭 이름은 1~25자로 입력해주세요.');return;}
      if(taskGroups().some((g)=>g.id!==id && g.title.trim().toLocaleLowerCase()===title.toLocaleLowerCase())){
        toast('같은 이름의 탭이 이미 있습니다.');return;
      }
      if(!id && taskGroups().length>=30){toast('탭은 최대 30개까지 만들 수 있어요.');return;}
      const groupId=id||uid();
      ui.taskGroup=groupId;
      await mutate((next)=>{
        if(id){const found=next.taskGroups.find((g)=>g.id===id);if(found)found.title=title;}
        else next.taskGroups.push({id:groupId,title});
      },id?'탭 이름을 변경했습니다.':'새 탭을 추가했습니다.');
      dialog.close();
      return;
    }
    const collection={plan:'plans',booking:'bookings',place:'places',task:'tasks'}[kind];
    if(!collection)return;
    let data;
    if(kind==='plan') {
      if(!dateInTrip(get('date'))) { toast('일정 날짜는 여행 기간 안에서 선택해주세요.'); return; }
      data={date:get('date'),time:get('time'),title:get('title'),category:get('category'),location:get('location'),bookingId:get('bookingId'),url:safeUrl(get('url')),note:get('note')};
    } else if(kind==='booking') {
      if(get('endDate') && get('startDate')>get('endDate')) {toast('종료 날짜는 시작 날짜보다 빠를 수 없습니다.');return;}
      data={title:get('title'),type:get('type'),startDate:get('startDate'),endDate:get('endDate'),
        startTime:get('startTime'),endTime:get('endTime'),location:get('location'),
        reference:get('reference'),url:safeUrl(get('url')),note:get('note')};
      const scheduleMode=get('scheduleMode');
      const existingPlanId=get('existingPlanId');
      if(scheduleMode==='existing' && !existingPlanId) {toast('연결할 기존 일정을 선택해주세요.');return;}
      if(scheduleMode==='existing') {
        const target=state.plans.find((p)=>p.id===existingPlanId);
        if(!target || (target.bookingId && target.bookingId!==id)) {toast('이미 다른 예약에 연결된 일정입니다.');return;}
      }
    } else if(kind==='place') {
      data={title:get('title'),type:get('type'),region:get('region'),url:safeUrl(get('url')),mapUrl:safeUrl(get('mapUrl')),note:get('note'),liked:f.has('liked')};
    } else if(kind==='task') {
      const group=get('group');
      if(!taskGroups().some((g)=>g.id===group)){toast('존재하지 않는 탭입니다.');return;}
      const category=get('category');
      data={title:get('title'),group,category:Object.hasOwn(taskCategoryOptions(group),category)?category:'misc',owner:get('owner'),url:safeUrl(get('url')),note:get('note'),done:f.has('done')};
    }
    if(!data.title) {toast('이름을 입력해주세요.');return;}
    await mutate((next)=>{
      if(kind==='booking') {
        const oldBooking=id?next.bookings.find((b)=>b.id===id):null;
        const previousBooking=oldBooking?{...oldBooking}:null;
        const bookingId=id||uid();
        const booking={...(oldBooking||{}),id:bookingId,...data};
        if(oldBooking) Object.assign(oldBooking,data);
        else next.bookings.push(booking);
        if(oldBooking) syncAutoAgenda(next,booking,previousBooking);
        if(get('scheduleMode')==='existing') {
          const target=next.plans.find((p)=>p.id===get('existingPlanId'));
          if(target && (!target.bookingId || target.bookingId===bookingId)) target.bookingId=bookingId;
        } else if(get('scheduleMode')==='auto') createAgendaForBooking(next,booking);
      } else if(id){
        const idx=next[collection].findIndex((i)=>i.id===id);
        if(idx>=0)next[collection][idx]={...next[collection][idx],...data};
      } else next[collection].push({id:uid(),...data});
    },id?'수정했습니다.':'추가했습니다.');
    dialog.close();
  }
  async function removeItem(kind,id) {
    const collection={plan:'plans',booking:'bookings',place:'places',task:'tasks'}[kind];
    if(!collection||!id)return;
    const item=state[collection].find((x)=>x.id===id);
    if(!item)return;
    const deletePrompt=kind==='booking'?`'${item.title}' 예약을 삭제할까요? 연결된 일정은 남겨두고 예약 연결만 해제합니다.`:`'${item.title}' 항목을 삭제할까요?`;
    if(!window.confirm(deletePrompt))return;
    await mutate((next)=>{
      next[collection]=next[collection].filter((x)=>x.id!==id);
      if(kind==='booking')next.plans.forEach((p)=>{if(p.bookingId===id)p.bookingId='';});
    },'삭제했습니다.');
    if(dialog.open)dialog.close();
  }
  function exportData() {
    const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download=`phuquoc-trip-backup-${todayISO()}.json`;
    document.body.appendChild(a);
    a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),2000);
    toast('백업 파일을 저장했습니다.');
  }
  async function importData(file) {
    if(!file)return;
    if(file.size>2*1024*1024) {toast('2MB 이하 백업 파일만 불러올 수 있어요.');return;}
    try {
      const json=JSON.parse(await file.text());
      if(!window.TripStore.validState(json))throw new Error('지원하지 않는 데이터 형식');
      if(!/^\d{4}-\d{2}-\d{2}$/.test(json.trip.startDate)||!/^\d{4}-\d{2}-\d{2}$/.test(json.trip.endDate))throw new Error('날짜 정보가 잘못되었습니다.');
      const duration=daysBetween(json.trip.startDate,json.trip.endDate);
      if(!Number.isFinite(duration)||duration<0||duration>59)throw new Error('지원하지 않는 여행 기간입니다.');
      if(!window.confirm(store.isCloud?'부부가 공유하는 모든 여행 데이터를 이 백업 파일로 교체할까요? 두 사람에게 함께 적용됩니다.':'현재 기기에 저장된 여행 데이터를 백업 파일 내용으로 교체할까요?'))return;
      await store.save(json);
      ui.selectedDate=defaultSelectedDate();
      if(dialog.open)dialog.close();
      toast('백업 파일을 불러왔습니다.');
    }catch(error){toast('백업 파일을 열지 못했습니다: '+error.message);}
    finally{inputFile.value='';}
  }
  async function shareLink() {
    const url=location.href.split('#')[0];
    if(location.protocol==='file:') {toast('GitHub Pages에 게시한 후 공유 링크를 사용할 수 있어요.');return;}
    try {
      if(navigator.share){await navigator.share({title:'우리 가족 푸꾸옥 여행',url});return;}
      if(navigator.clipboard){await navigator.clipboard.writeText(url);toast(store.isCloud?'앱 링크를 복사했습니다. 가족 계정 로그인 후 사용할 수 있어요.':'앱 링크를 복사했습니다. 데이터는 공유되지 않습니다.');return;}
    }catch(error){if(error.name==='AbortError')return;}
    window.prompt(store.isCloud?'아래 주소를 복사하세요. 가족 계정 로그인이 필요합니다.':'아래 주소를 복사하세요. 이 기기 데이터는 공유되지 않습니다.',url);
  }
  async function handleAction(button) {
    const action=button.dataset.action,id=button.dataset.id,kind=button.dataset.kind;
    if(action==='tab'){switchTab(button.dataset.tab);return;}
    if(action==='settings'){settings();return;}
    if(action==='close'){dialog.close();return;}
    if(action==='select-date'){ui.selectedDate=button.dataset.date;render();return;}
    if(action==='add'){editor(kind,null,kind==='task'?{group:ui.taskGroup,category:'misc'}:{});return;}
    if(action==='edit'){editor(kind,id);return;}
    if(action==='booking-detail'){editor('booking',id);return;}
    if(action==='booking-from-plan'){
      const plan=state.plans.find((p)=>p.id===id);
      if(!plan)return;
      const type=plan.category==='stay'?'hotel':plan.category==='move'?'transport':'activity';
      editor('booking',null,{title:plan.title,date:plan.date,startDate:plan.date,
        startTime:plan.time,location:plan.location,type,originPlanId:plan.id,
        url:plan.url});
      return;
    }
    if(action==='show-booking-plans'){
      const linked=linkedPlans(id).sort((a,b)=>a.date.localeCompare(b.date));
      if(linked.length){ui.selectedDate=linked[0].date;switchTab('plans');}
      return;
    }
    if(action==='booking-to-plan'){
      const booking=state.bookings.find((b)=>b.id===id);
      if(!booking)return;
      const count=missingAgendaTemplates(booking,state.plans).filter((t)=>dateInTrip(t.date)).length;
      if(!count){toast('여행 기간에 추가할 새 일정이 없어요.');return;}
      await mutate((next)=>{
        const found=next.bookings.find((b)=>b.id===id);
        if(found)createAgendaForBooking(next,found);
      },`일정 ${count}개를 추가했습니다.`);
      ui.selectedDate=booking.startDate;switchTab('plans');
      return;
    }
    if(action==='delete'){await removeItem(kind,id);return;}
    if(action==='add-task-group'){editor('taskGroup');return;}
    if(action==='manage-task-groups'){manageTaskGroups();return;}
    if(action==='edit-task-group'){editor('taskGroup',id);return;}
    if(action==='delete-task-group'){openTaskGroupDelete(id);return;}
    if(action==='confirm-delete-task-group'){await confirmTaskGroupDelete(id,button.dataset.strategy);return;}
    if(action==='toggle-task'){await mutate((next)=>{const t=next.tasks.find((x)=>x.id===id);if(t)t.done=!t.done;});return;}
    if(action==='task-group'){
      if(!taskGroups().some((g)=>g.id===button.dataset.group))return;
      ui.taskGroup=button.dataset.group;ui.taskIncompleteOnly=false;render();return;
    }
    if(action==='task-filter'){ui.taskIncompleteOnly=!ui.taskIncompleteOnly;render();return;}
    if(action==='install-checklist'){
      const missing=(window.TripRecommendedTasks||[]).filter((t)=>taskGroups().some((g)=>g.id===t.group) && !state.tasks.some((s)=>s.id===t.id));
      if(!missing.length){toast('추천 항목이 모두 등록되어 있어요.');return;}
      if(!window.confirm(`추천 항목 ${missing.length}개를 현재 체크리스트에 추가할까요? 기존 항목은 유지됩니다.`))return;
      await mutate((next)=>{next.tasks.push(...missing.map((t)=>({...t})));},`추천 항목 ${missing.length}개를 추가했습니다.`);
      return;
    }
    if(action==='favorite'){await mutate((next)=>{const p=next.places.find((x)=>x.id===id);if(p)p.liked=!p.liked;},'찜 목록을 변경했습니다.');return;}
    if(action==='place-to-plan'){
      const p=state.places.find((x)=>x.id===id);
      if(p)editor('plan',null,{title:p.title,location:p.title,category:p.type==='food'||p.type==='cafe'?'food':'activity',url:p.url||p.mapUrl||googleMapLink(p.title)});
      return;
    }
    if(action==='place-filter'){ui.placeFilter=button.dataset.filter;render();return;}
    if(action==='region-filter'){ui.regionFilter=button.dataset.filter;render();return;}
    if(action==='reset-filter'){ui.placeFilter='all';ui.regionFilter='all';render();return;}
    if(action==='export'){exportData();return;}
    if(action==='import'){inputFile.click();return;}
    if(action==='share'){shareLink();return;}
    if(action==='logout' && store.isCloud){ if(window.confirm('로그아웃할까요?')) await store.logout(); return; }
    if(action==='reset'){
      if(!window.confirm(store.isCloud?'부부가 함께 쓰는 모든 여행 정보가 초기화됩니다. 정말 초기화할까요?':'모든 여행 정보가 삭제됩니다. 초기화할까요?'))return;
      await store.save(window.TripStore.freshData());
      ui.selectedDate=defaultSelectedDate();
      if(dialog.open)dialog.close();
      toast('예시 데이터로 초기화했습니다.');
    }
  }

  document.addEventListener('click',(event)=>{
    const button=event.target.closest('[data-action]');
    if(!button)return;
    event.preventDefault();
    handleAction(button).catch((error)=>{console.error(error);toast('처리 중 오류가 발생했습니다.');});
  });
  document.addEventListener('submit',(event)=>{
    const form=event.target.closest('form[data-editor]');
    if(!form)return;
    event.preventDefault();
    saveForm(form).catch((error)=>{console.error(error);toast('저장 중 오류가 발생했습니다.');});
  });
  dialog.addEventListener('change',(event)=>{
    if(event.target.matches('select[name="group"]')){
      const form=event.target.closest('form[data-editor="task"]');
      const category=form&&form.querySelector('select[name="category"]');
      if(category){category.innerHTML=options(taskCategoryOptions(event.target.value),'misc');category.value='misc';}
    }
  });
  inputFile.addEventListener('change',()=>importData(inputFile.files[0]));
  dialog.addEventListener('click',(event)=>{if(event.target===dialog)dialog.close();});
  store.subscribe((next)=>{state=next;render();});
  store.init().then((data)=>{
    state=data;
    ui.selectedDate=defaultSelectedDate();
    render();
    if(!store.persistent)toast('브라우저 저장이 제한되어 현재 세션에만 기록될 수 있어요.');
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      navigator.serviceWorker.register('./sw.js').catch((error)=>console.warn('오프라인 캐시를 등록하지 못했습니다.', error));
    }
  }).catch((error)=>{
    console.error(error);
    root.innerHTML='<div class="empty-state"><strong>앱을 열지 못했습니다.</strong><p>페이지를 새로고침 해주세요.</p></div>';
  });
})();
