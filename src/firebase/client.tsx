// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbXXMeZV-5kue3LbWeFs8-aJB61WR0k0w",
  authDomain: "fridge-poetry-social.firebaseapp.com",
  projectId: "fridge-poetry-social",
  storageBucket: "fridge-poetry-social.firebasestorage.app",
  messagingSenderId: "172708933915",
  appId: "1:172708933915:web:29e85d410b41ab684023be",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
export const auth = getAuth(app);
