// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsol7s1JJmKNGqjxL1FDe7XgbSYIIV-zI",
  authDomain: "login-rn-itt2014b.firebaseapp.com",
  projectId: "login-rn-itt2014b",
  storageBucket: "login-rn-itt2014b.firebasestorage.app",
  messagingSenderId: "368387234249",
  appId: "1:368387234249:web:25375a99721c6079213018"
};

// Initialize Firebase
export default app = initializeApp(firebaseConfig); 
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
export { db };