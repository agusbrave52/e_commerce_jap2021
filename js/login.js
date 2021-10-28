//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    if(localStorage.getItem("Usuario")){
        window.location = "home.html";
    }
});
function loguear() { // Creo la funcion para poder loguear() para terminar de verificar y loguearse
    let usuario = document.getElementById("usuario"); //traigo datos del input usuario
    let contrasena = document.getElementById("contrasena"); //traigo datos del input contraseña
    
    if (usuario.checkValidity() && contrasena.checkValidity()) { //valido con la funcion checkValidity() que verifica las validaciones del HTML y devuelve un booleano
        localStorage.setItem("Usuario", usuario.value);//Guardo el valor de campo usuario en localStorage
        window.location = "home.html" //redirijo la pagina a home
    }
    else {
        if (usuario.checkValidity() == false) { //hago unos if para cambiar el mensaje de error del usuario y mas abajo contraseña
            let error = document.getElementById("msContrasena");
            error.innerHTML = usuario.validationMessage + ": Usuario";
        }
        else {
            if (contrasena.checkValidity() == false) {
                let error = document.getElementById("msContrasena");
                error.innerHTML = contrasena.validationMessage + ": Contraseña";
            }
        }
    }
}
function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
    document.getElementById("usuario").value = profile.getEmail();
    document.getElementById("contrasena").value = "123456";
    document.getElementById("entrar").click();
  }
