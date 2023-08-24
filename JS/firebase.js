// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAUuOzPZ1k3-YKMtQzO1AX9XE_hUgS0LhA",
  authDomain: "bibliotek-6aa3f.firebaseapp.com",
  databaseURL: "https://bibliotek-6aa3f-default-rtdb.firebaseio.com",
  projectId: "bibliotek-6aa3f",
  storageBucket: "bibliotek-6aa3f.appspot.com",
  messagingSenderId: "459978600030",
  appId: "1:459978600030:web:ccd097da5ab5c2c72a4ecf"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize variables
const auth = firebase.auth()
const database = firebase.database()

// Set up our register function
function register() {
  // Obtén todos nuestros campos de entrada
  email = document.getElementById('email').value
  password = document.getElementById('password').value
  first_name = document.getElementById('first_name').value
  last_name = document.getElementById('last_name').value
  dni = document.getElementById('dni').value
  roles = document.getElementById('roles').value

  // Valida los campos de entrada
  if (validate_field(first_name) == false || validate_field(last_name) == false || validate_field(dni) == false) {
    alert('Debe rellenar los campos vacíos')
    return
  }
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Debe digitar un correo o contraseña válidos')
    return
    // No continúes ejecutando el código
  }

  // Continúa con la autenticación
  auth.createUserWithEmailAndPassword(email, password)
    .then(function () {
      // Obtiene el usuario actual
      var user = auth.currentUser

      // Agrega este usuario a la base de datos de Firebase
      var database_ref = database.ref('/');

      // Crea los datos del usuario
      var user_data = {
        email: email,
        first_name: first_name,
        last_name: last_name,
        last_login: Date.now(),
        dni: dni,
        roles: roles,
        password: password // Agrega el campo Contraseña
      }

      // Agrega a la base de datos de Firebase
      database_ref.child('users/' + user.uid).set(user_data)

      // Listo
      alert('Usuario creado satisfactoriamente!');
      //window.location.href = "../HTML/Login.html";
    })
    .catch(function (error) {
      // Firebase utilizará esto para alertar de sus errores
      var error_code = error.code
      var error_message = error.message

      alert(error_message)
    })
}


// Set up our login function
function login() {
  // Obtén todos los campos de entrada
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  // Valida los campos de entrada
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('El correo o la contraseña son incorrectos.');
    return;
    // No continúes ejecutando el código
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(function () {
      // Obtiene el usuario actual
      var user = auth.currentUser;
      var database_ref = database.ref('users/' + user.uid);

      // Realiza una consulta a la base de datos para obtener los datos del usuario
      database_ref.once('value', function (snapshot) {
        var userData = snapshot.val();
        if (userData) {
          var roles = userData.roles;

          // Verifica el rol del usuario y redirige según corresponda
          if (roles === 'administrador') {
            // Redirige al panel de administrador
            window.location.href = "../HTML/PrincipalAdmin.html";
          } else {
            // Redirige a la página principal para miembros
            window.location.href = "../HTML/PrincipalUsuario.html";
          }

          // Actualiza la última hora de inicio de sesión en la base de datos
          database_ref.update({
            last_login: Date.now()
          });

          alert('¡Has iniciado sesión exitosamente!'); //Debug, eliminar en la v final
        } else {
          // No se encontraron datos del usuario en la base de datos
          alert('No se encontraron datos del usuario en la base de datos.');
        }
      });
    })
    .catch(function (error) {
      // Firebase utilizará esto para alertar de sus errores
      var errorCode = error.code;
      var errorMessage = error.message;

      alert(errorMessage);
    });
}


// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}


function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}


function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}


function generarContrasena() {
  var caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var longitud = 10;
  var contrasena = "";

  for (var i = 0; i < longitud; i++) {
    var indice = Math.floor(Math.random() * caracteres.length);
    contrasena += caracteres.charAt(indice);
  }

  document.getElementById("password").value = contrasena;
}


function togglePasswordVisibility() {
  var passwordInput = document.getElementById("password");
  var toggleButton = document.querySelector(".btn-toggle-password");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleButton.textContent = "Ocultar";
  } else {
    passwordInput.type = "password";
    toggleButton.textContent = "Mostrar";
  }
}


//Actualizar o crear valores en BD Usuarios.  -Se usa en Registro.html y AgregarUsuarios.html-
database.ref("users").on("child_added", snapshot => {
  const user = snapshot.val();

  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${user.first_name}</td>
    <td>${user.last_name}</td>
    <td>${user.roles}</td>
    <td>${user.dni}</td>
    <td>${user.email}</td>
    <td>${user.password}</td>
    <td>
        <button class="btn btn-warning btn-sm edit" data-id="${snapshot.key}">Editar</button>
        <button class="btn btn-danger btn-sm delete" data-id="${snapshot.key}">Eliminar</button>
      </td>
    `;

  document.querySelector(".user-list").appendChild(newRow);
});


//Consulta información de la BD Usuarios.  -Se usa en Perfil.html-
document.addEventListener("DOMContentLoaded", function () {
  const userNameElement = document.querySelector("h2");
  const userEmailElement = document.querySelector("p");

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // El usuario está autenticado, mostrar datos
      if (user.displayName) {
        userNameElement.textContent = user.displayName;
      } else {
        firebase.database().ref('users/' + user.uid).once('value').then(function (snapshot) {
          let userData = snapshot.val();
          if (userData && userData.first_name && userData.last_name) {
            userNameElement.textContent = userData.first_name + ' ' + userData.last_name;
          } else {
            userNameElement.textContent = "Nombre no disponible";
          }
        });
      }
      userEmailElement.textContent = "Correo electrónico: " + user.email;
    } else {
      // No hay usuario autenticado
      userNameElement.textContent = "Usuario no autenticado";
      userEmailElement.textContent = "Correo electrónico: No disponible";
    }
  });
});


//Consulta todos los usuarios en BD.  -Se usa en AdministrarUsuarios.html-
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("edit")) {
    const userId = event.target.getAttribute("data-id");
    // Redirigir a la página de edición con el ID del usuario en el parámetro de consulta
    window.location.href = `../HTML/EditarUsuario.html?id=${userId}`;

    // Implement the logic to edit user data and save it back to the database
  } else if (event.target.classList.contains("delete")) {
    const userId = event.target.getAttribute("data-id");

    // Delete the user data from the Firebase Realtime Database
    database.ref("users").child(userId).remove();

    // Remove the row from the table immediately after deletion
    event.target.closest("tr").remove();
    console.log("Delete button clicked for user with ID:", userId);
  }
});


//Permite modificar el Usuario en la BD  -Se usa en EditarUsuario.html
document.addEventListener("DOMContentLoaded", function () {
  // Obtén el ID del usuario de la consulta de parámetros
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("id");

  // Obtén una referencia a los campos de edición en el HTML
  const firstNameField = document.getElementById("first_name");
  const lastNameField = document.getElementById("last_name");
  const rolesField = document.getElementById("roles");
  const dniField = document.getElementById("dni");
  const emailField = document.getElementById("email");
  const updateButton = document.getElementById("update-button");

  // Obtén una referencia al elemento del botón de actualización

  // Carga los datos actuales del usuario en los campos de edición
  const userRef = database.ref("users/" + userId);
  userRef.once("value", function (snapshot) {
    const userData = snapshot.val();
    if (userData) {
      firstNameField.value = userData.first_name;
      lastNameField.value = userData.last_name;
      rolesField.value = userData.roles;
      dniField.value = userData.dni;
      emailField.value = userData.email;
    }
  });
});