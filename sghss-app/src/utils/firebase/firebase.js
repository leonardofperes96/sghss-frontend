// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  doc,
  getDoc,
  query,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyASN2BW8goSQcuiGlh2tRcBllqpEKDPTsE",

  authDomain: "reactgram-8bb03.firebaseapp.com",

  projectId: "reactgram-8bb03",

  storageBucket: "reactgram-8bb03.appspot.com",

  messagingSenderId: "434044095636",

  appId: "1:434044095636:web:5b2f66ed05aed789f8f881",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth();

const provider = new GoogleAuthProvider();

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  db,
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  onSnapshot,
  updateDoc,
  deleteDoc,
  provider,
  signInWithPopup,
};
