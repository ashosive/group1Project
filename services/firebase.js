import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJQZEIFEZ2L7bRq_IxO74-es5uIfeAxX4",
  authDomain: "pharmanearby.firebaseapp.com",
  projectId: "pharmanearby",
  storageBucket: "pharmanearby.firebasestorage.app",
  messagingSenderId: "36381741935",
  appId: "1:36381741935:web:408deaa5d7e9f370848e9a",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
