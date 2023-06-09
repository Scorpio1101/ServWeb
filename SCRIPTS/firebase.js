import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyAh6OiYemZEyhuiC2XV1z43k5V7OQEl6SE",
    authDomain: "final-web-proyect.firebaseapp.com",
    databaseURL: "https://final-web-proyect-default-rtdb.firebaseio.com",
    projectId: "final-web-proyect",
    storageBucket: "final-web-proyect.appspot.com",
    messagingSenderId: "841492413911",
    appId: "1:841492413911:web:a77d4a457bddb081de1f92"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)