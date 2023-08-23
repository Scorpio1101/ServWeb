// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth,sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAUuOzPZ1k3-YKMtQzO1AX9XE_hUgS0LhA",
    authDomain: "bibliotek-6aa3f.firebaseapp.com",
    databaseURL: "https://bibliotek-6aa3f-default-rtdb.firebaseio.com",
    projectId: "bibliotek-6aa3f",
    storageBucket: "bibliotek-6aa3f.appspot.com",
    messagingSenderId: "459978600030",
    appId: "1:459978600030:web:ccd097da5ab5c2c72a4ecf"
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  
  const resetButton = document.getElementById('reset-password'); // Cambio aquí
  
  resetButton.addEventListener('click', (e) => {
      var email = document.getElementById('email').value;
  
      sendPasswordResetEmail(auth, email)
          .then(() => {
              alert('Correo enviado');
          })
          .catch((error) => {
              const errorMessage = error.message;
              alert(errorMessage);
          });
  });
  