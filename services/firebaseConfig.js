import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD1EQooyu4ilpqD13kcybUE5D3HxxoN_kM',
  authDomain: 'homeops-ca72f.firebaseapp.com',
  projectId: 'homeops-ca72f',
  storageBucket: 'homeops-ca72f.firebasestorage.app',
  messagingSenderId: '313647776955',
  appId: '1:313647776955:web:b64c874dc0a121aa83959e',
  measurementId: 'G-R28D3WE6XL',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
