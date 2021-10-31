//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  if(localStorage.getItem("imgPerfil") != null){ //Cuando inicio verifico si esta cargada la imagen del perfil
    $("#imgPerfil").attr("src", localStorage.getItem("imgPerfil")) //si esta cargada la muestro en el perfil
  }
  if(localStorage.getItem("infoUsuario"))
  {
    let usuario = JSON.parse(localStorage.getItem("infoUsuario")) //traigo la informacion del usuario sobre el perfil
    $("#txtName")[0].value = usuario.Nombre; //inserto en cada input text la info del usuario
    $("#txtLsname")[0].value = usuario.Apellido;
    $("#txtEdad")[0].value = usuario.Edad;
    $("#txtTel")[0].value = usuario.Telefono;
    $("#txtEmail")[0].value = usuario.Email;
  }
});
function readerURL(inputImg) { //creo un reader para poder leer la imagen y gaurdarla en base 64
    if (inputImg.files && inputImg.files[0]) { //Reviso que el inputImg tenga contenido
      var reader = new FileReader(); //Leemos el contenido
      reader.onloadend = function(e) { 
        $('#imgPerfil').attr('src', e.target.result);//Al cargar el contenido lo pasamos como atributo de la imagen de arriba
      }
      reader.readAsDataURL(inputImg.files[0]);//lee el archivo 
    }
  }
$("#slcImagen").change(function() { //Cuando el input cambie (se cargue un nuevo archivo) se va a ejecutar de nuevo el cambio de imagen y se verá reflejado.
    readerURL(this);
});
$("#btnGuardar").click(function(){
    let usuario = { //asigno cada info del usuario segun los input del html
        Nombre : $("#txtName")[0].value,
        Apellido : $("#txtLsname")[0].value,
        Edad : $("#txtEdad")[0].value,
        Telefono : $("#txtTel")[0].value,
        Email : $("#txtEmail")[0].value
    }
    localStorage.setItem("imgPerfil", $("#imgPerfil").attr("src")) //seteo la imagen para guardarla en localstorage
    localStorage.setItem("infoUsuario", JSON.stringify(usuario)) //seteo la info del usuario para guardarla en localstorage
})