import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTXim9McjpoHnYS7JD_VDyN5oGuzhvAIU",
  authDomain: "tdf-lms.firebaseapp.com",
  databaseURL: "https://tdf-lms-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tdf-lms",
  storageBucket: "tdf-lms.firebasestorage.app",
  messagingSenderId: "908600031747",
  appId: "1:908600031747:web:f59d0f9d7c52514e2d6c36",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);