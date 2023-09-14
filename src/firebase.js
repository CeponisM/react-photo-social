import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAWpGyX0HXZCVf9uG-Mcymf2q_XTHYzGHQ",
  authDomain: "react-photosocial.firebaseapp.com",
  projectId: "react-photosocial",
  storageBucket: "react-photosocial.appspot.com",
  messagingSenderId: "336922035441",
  appId: "1:336922035441:web:32fb3e527e36398e69d550"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);