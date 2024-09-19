import {getFirestore} from "firebase/firestore"
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyB5bauF5nsv9gGTVzLIkzRW0WkmiLl9hD8",
  authDomain: "learning-firebase-bbc4d.firebaseapp.com",
  projectId: "learning-firebase-bbc4d",
  storageBucket: "learning-firebase-bbc4d.appspot.com",
  messagingSenderId: "908312773465",
  appId: "1:908312773465:web:69e71039c4d7178221c248",
  measurementId: "G-0DV36EXS3J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
