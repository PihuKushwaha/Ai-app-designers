import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Anonymous auth is enough to let each visitor save/reload their own past
// blueprints without building a full login system for v1. Swap for
// email/Google auth later if you want blueprints to follow a real account.
export function ensureSignedIn(callback) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user)
    } else {
      signInAnonymously(auth).catch((err) => console.error('Anonymous sign-in failed', err))
    }
  })
}

export async function saveBlueprint(uid, { appName, idea, history, markdown }) {
  const ref = collection(db, 'users', uid, 'blueprints')
  await addDoc(ref, {
    appName,
    idea,
    history,
    markdown,
    createdAt: serverTimestamp()
  })
}

export function subscribeToBlueprints(uid, callback) {
  const ref = query(collection(db, 'users', uid, 'blueprints'), orderBy('createdAt', 'desc'))
  return onSnapshot(ref, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}
