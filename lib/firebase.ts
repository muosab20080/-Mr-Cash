import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyADgIWcEM0e9DI3CJM_buPNppFEjdrol68',
  authDomain: 'mrcash-net.firebaseapp.com',
  projectId: 'mrcash-net',
  storageBucket: 'mrcash-net.firebasestorage.app',
  messagingSenderId: '744075595294',
  appId: '1:744075595294:web:b7249075205dd4eee3e80f'
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()

export { app, auth, db, googleProvider }
