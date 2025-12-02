import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCcrYXfGRt4YEXGCqlqe-03UL1mA4NSNA8",
  authDomain: "endoia.firebaseapp.com",
  projectId: "endoia",
  storageBucket: "endoia.firebasestorage.app",
  messagingSenderId: "494853206194",
  appId: "1:494853206194:web:176136166a25c2813619ab",
  measurementId: "G-YDLB7CXLZ4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, onAuthStateChanged };
