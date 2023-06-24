import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCaYSw-nL-UEayejFYSJQwKYe9ICIzbTU",
  authDomain: "skillfinder-c3552.firebaseapp.com",
  projectId: "skillfinder-c3552",
  storageBucket: "skillfinder-c3552.appspot.com",
  messagingSenderId: "961069502262",
  appId: "1:961069502262:web:4c71bd80cabee44dc96d97",
  measurementId: "G-55L484350V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db};