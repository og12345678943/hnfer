// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChgui-E6Dkl2t3RkIfV0RMFv-OdbvaCqY",
  authDomain: "linkup-c4552.firebaseapp.com",
  projectId: "linkup-c4552",
  storageBucket: "linkup-c4552.firebasestorage.app",
  messagingSenderId: "859975413988",
  appId: "1:859975413988:web:d9b5b53351e7c1e500fcf1",
  measurementId: "G-6MXMK8REQN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;