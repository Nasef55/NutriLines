import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAY52ark6qonkx_K4EueEwUJEkljIYqsmU",
  authDomain: "nutrilines.firebaseapp.com",
  projectId: "nutrilines",
  storageBucket: "nutrilines.firebasestorage.app",
  messagingSenderId: "236263520346",
  appId: "1:236263520346:web:f95306ce19683aeba10063",
  measurementId: "G-BJHCLFWJRS"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);