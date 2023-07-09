import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyB3DKwKDjJGopnsJkjef7xIC14y07lpk6w",
  authDomain: "frenzyquiz.firebaseapp.com",
  projectId: "frenzyquiz",
  storageBucket: "frenzyquiz.appspot.com",
  messagingSenderId: "164784748481",
  appId: "1:164784748481:web:e18968de38400352a6a140",
  measurementId: "G-HW9WQGBDDH"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)