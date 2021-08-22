//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

});
function loguear() { // Creo la funcion para poder loguear() para terminar de verificar y loguearse
    let usuario = document.getElementById("usuario"); //traigo datos del input usuario
    let contrasena = document.getElementById("contrasena"); //traigo datos del input contraseña
    
    if (usuario.checkValidity() && contrasena.checkValidity()) { //valido con la funcion checkValidity() que verifica las validaciones del HTML y devuelve un booleano
        window.location = "/home.html" //redirijo la pagina a home
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
