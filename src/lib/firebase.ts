import { initializeApp, getApps } from "firebase/app";

import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCNmLEaMpHZdywwIGMCjtX7mK6Pqof5QKo",
  authDomain: "sonorous-zone-419218.firebaseapp.com",
  projectId: "sonorous-zone-419218",
  storageBucket: "sonorous-zone-419218.appspot.com",
  messagingSenderId: "92492916093",
  appId: "1:92492916093:web:95ec4a28244cbefc771814",
  measurementId: "G-4K8F31XFSE"
};


export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();