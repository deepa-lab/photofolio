// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5gAZWh5O8-sGmFifQ9np_Wl8iUE0JCWs",
  authDomain: "my-app-191c0.firebaseapp.com",
  projectId: "my-app-191c0",
  storageBucket: "my-app-191c0.firebasestorage.app",
  messagingSenderId: "1021928232114",
  appId: "1:1021928232114:web:e6bdae877072b9266d65ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
