// firebase app initialization
import { initializeApp } from "firebase/app";
// import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

import { firebaseConfig } from "./firebase-config";

// Initialize Firebase
export const firebaseAppInstance = initializeApp(firebaseConfig);

// export firebase auth
export const firebaseAuth = getAuth(firebaseAppInstance);

// export const firebaseAnalytics = getAnalytics(firebaseAppInstance);
export const firebaseDB = getFirestore(firebaseAppInstance);

//export firebase storage
export const firebaseStorage = getStorage(firebaseAppInstance);
