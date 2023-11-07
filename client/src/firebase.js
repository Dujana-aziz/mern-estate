// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'mern-estate-30fec.firebaseapp.com',
  projectId: 'mern-estate-30fec',
  storageBucket: 'mern-estate-30fec.appspot.com',
  messagingSenderId: '433830030750',
  appId: '1:433830030750:web:b1284742d707ffe51e7a8f',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
