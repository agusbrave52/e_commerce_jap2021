//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  if(localStorage.getItem("imgPerfil") != null){
    $("#imgPerfil").attr("src", localStorage.getItem("imgPerfil"))
  }
    let usuario = JSON.parse(localStorage.getItem("infoUsuario"))
    $("#txtName")[0].value = usuario.Nombre;
    $("#txtLsname")[0].value = usuario.Apellido;
    $("#txtEdad")[0].value = usuario.Edad;
    $("#txtTel")[0].value = usuario.Telefono;
    $("#txtEmail")[0].value = usuario.Email;
});
function readerURL(inputImg) {
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
    let usuario = {
        Nombre : $("#txtName")[0].value,
        Apellido : $("#txtLsname")[0].value,
        Edad : $("#txtEdad")[0].value,
        Telefono : $("#txtTel")[0].value,
        Email : $("#txtEmail")[0].value
    }
    localStorage.setItem("imgPerfil", $("#imgPerfil").attr("src"))
    localStorage.setItem("infoUsuario", JSON.stringify(usuario))
})