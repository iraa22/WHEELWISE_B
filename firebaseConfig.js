// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMUJb1NwTkmyx0DAF_2k7322qv_dVXx7s",
  authDomain: "wheelwise-f5e63.firebaseapp.com",
  projectId: "wheelwise-f5e63",
  storageBucket: "wheelwise-f5e63.firebasestorage.app",
  messagingSenderId: "1016636791806",
  appId: "1:1016636791806:web:478a8259a6c0130059beaf"
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
