// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);