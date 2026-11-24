/*
  v6 shared cover image.
  A single resized JPEG data URI is stored on the already-protected trips/{tripId}
  Firestore document. Nothing is uploaded to public GitHub or Firebase Storage.
  Firestore's 1 MiB document limit is respected by a conservative image cap.
*/
const COVER_LIMIT = 370000;
const LOCAL_KEY = 'phuquoc-family-cover:v1';
const SDK_ROOT = 'https://www.gstatic.com/firebasejs/13.3.0/';
const isValidCover = (value) => typeof value === 'string' &&
  value.length <= COVER_LIMIT &&
  /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(value);

const cover = {
  image: '',
  error: '',
  ready: false,
  cloud: false,
  listeners: new Set(),
  subscribe(callback) { this.listeners.add(callback); return () => this.listeners.delete(callback); },
  emit() { for (const callback of this.listeners) callback(this.image); },
  async init(isCloud) {
    this.cloud = !!isCloud;
    if (!isCloud) {
      try {
        const previous = localStorage.getItem(LOCAL_KEY);
        this.image = isValidCover(previous) ? previous : '';
      } catch (error) { this.error = error.message; }
      this.ready = true;
      this.emit();
      return;
    }

    const [{ getApp }, { getAuth }, { getFirestore, doc, onSnapshot, updateDoc, deleteField }] = await Promise.all([
      import(SDK_ROOT + 'firebase-app.js'),
      import(SDK_ROOT + 'firebase-auth.js'),
      import(SDK_ROOT + 'firebase-firestore.js')
    ]);
    const app = getApp();
    const user = getAuth(app).currentUser;
    if (!user) throw new Error('Sign in before loading the shared cover.');
    this.updateDoc = updateDoc;
    this.deleteField = deleteField;
    this.tripRef = doc(getFirestore(app), 'trips', window.TripFirebaseTripId || 'phuquoc-family-2026');
    return new Promise((resolve, reject) => {
      let first = true;
      this.unsubscribe = onSnapshot(this.tripRef, (snap) => {
        if (!snap.exists()) {
          const err = new Error('Trip document not found.');
          this.error = err.message;
          if (first) { first = false; reject(err); }
          return;
        }
        const next = snap.data().coverPhotoData;
        this.image = isValidCover(next) ? next : '';
        this.error = '';
        this.ready = true;
        this.emit();
        if (first) { first = false; resolve(); }
      }, (err) => {
        this.error = err.code || err.message;
        if (first) { first = false; reject(err); }
        else this.emit();
      });
    });
  },
  async save(dataUri) {
    if (dataUri && !isValidCover(dataUri)) throw new Error('Compressed photo exceeds the permitted size.');
    if (!this.ready) throw new Error('Photo storage is not yet connected.');
    if (this.cloud) {
      await this.updateDoc(this.tripRef, dataUri
        ? { coverPhotoData: dataUri }
        : { coverPhotoData: this.deleteField() });
      // The snapshot listener updates all signed-in family devices.
    } else {
      try {
        if (dataUri) localStorage.setItem(LOCAL_KEY, dataUri);
        else localStorage.removeItem(LOCAL_KEY);
      } catch (error) { throw new Error('Not enough browser storage for this photo.'); }
      this.image = dataUri;
      this.emit();
    }
  },
  limit: COVER_LIMIT
};
window.TripCoverPhoto = cover;
