import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';


import {getReactNativePersistence, initializeAuth} from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = {
  apiKey: "AIzaSyDc0_bhNDfkiXZrjbwoGdvMKUPb-WLIpxA",
  authDomain: "murshid-f076f.firebaseapp.com",
  projectId: "murshid-f076f",
  storageBucket: "murshid-f076f.appspot.com",
  messagingSenderId: "466056794636",
  appId: "1:466056794636:web:b64d968b931a376d83d429",
  measurementId: "G-YKK74Q307S"
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

console.log("Firestore database:", db);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

