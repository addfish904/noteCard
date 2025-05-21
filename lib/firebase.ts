import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyBK0Xz-S1Z6IEFc7HcE2B4LyKQJj5-sJEA",
    authDomain: "note-project-9a3a7.firebaseapp.com",
    projectId: "note-project-9a3a7",
    storageBucket: "note-project-9a3a7.firebasestorage.app",
    messagingSenderId: "700461052399",
    appId: "1:700461052399:web:2ecb759f98eef4951f461a"
  };

const app = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const db = getFirestore(app);