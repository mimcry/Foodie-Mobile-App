import { firebase } from '@react-native-firebase/messaging';
import { initializeApp } from 'firebase/app'; // Import initializeApp from the 'firebase/app' package
import { getMessaging } from 'firebase/messaging'; // Import getMessaging from the 'firebase/messaging' package

const firebaseConfig = {
  apiKey: "AIzaSyA5d2a3uJyFZt98ST4vlnt_tFdhJw86i6o",
  authDomain: "foodie-1b1d7.firebaseapp.com",
  projectId: "foodie-1b1d7",
  storageBucket: "foodie-1b1d7.firebasestorage.app",
  messagingSenderId: "702169949561",
  appId: "1:702169949561:android:12105bf6b7c734c9023ba8",
};

// Initialize Firebase only once
let app;
if (!firebase.apps.length) {
  app = initializeApp(firebaseConfig); // Initialize Firebase app
} else {
  app = firebase.app(); // Use existing app instance
}

export const messaging = getMessaging(app); // Initialize messaging with the app instance
