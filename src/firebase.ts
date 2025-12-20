import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyAp2QOHPA7VzRtUd3TIdbSXTp49rxEsTEo",
  authDomain: "emotion-8ec70.firebaseapp.com",
  projectId: "emotion-8ec70",
  storageBucket: "emotion-8ec70.firebasestorage.app",
  messagingSenderId: "61911000586",
  appId: "1:61911000586:web:15788b7177320bad3e21f3"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Authentication
export const auth = getAuth(app);

// Firestore
export const db = getFirestore(app);