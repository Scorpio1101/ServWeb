import { signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { auth } from "./firebase.js";

const logout = document.querySelector("#logout");

logout.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await signOut(auth)
    console.log("signup out");

     window.location.href = "index.html"; // redirigir a la página de inicio después de cerrar sesión

  } catch (error) {
    console.log(error)
  }
});