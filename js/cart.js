let articulos = [];
let moneda;
let subtotal = 0;
let costoEnvio = 0;
let validacionModal;
document.addEventListener("DOMContentLoaded", function(e){ //hago un fetch para traer los articulos del carrito y ejecuto las funciones creadas 
  getJSONData("./generated.json").then(function(response){
    if(response.status === "ok"){
      articulos = response.data.articles;
      mostrarCarrito()
      updateSubtotal()
      updateTipoEnvio()
      cambiarMoneda(true)
    }
  })
  if(!document.forms["formModal"]["tarjetaC"].checked || !document.forms["formModal"]["tranferencia"].checked){
    document.forms["formModal"]["numT"].setAttribute("disabled",true);
    document.forms["formModal"]["venc"].setAttribute("disabled",true);
    document.forms["formModal"]["codSegu"].setAttribute("disabled",true);
    document.forms["formModal"]["numCuenta"].setAttribute("disabled",true);
    $("#txtValidacion")[0].innerHTML = "METODO DE PAGO NO VALIDADO";
    $("#txtValidacion").addClass("bg-danger text-light p-1")
    validacionModal = false;
  }
});
function mostrarCarrito(){//Creo funcion para mostrar la lista de los articulos del carrito
  let htmlAppend = "";
  for(i=0; i<articulos.length; i++){
      let costo = articulos[i].unitCost * articulos[i].count;//el costo lo calculo con el costo de unidad por la cantidad 
      htmlAppend +=`
      <div class="row carritoElem">
        <div class="col-2 text-center" id="imagen">
          <img src="${articulos[i].src}" alt="" class="img-fluid">
        </div>
        <div class="d-flex col">
          <ul class="p-0 w-100">
            <li class="carrito">
              <span class="align-self-center">${articulos[i].name}</span>
            </li>
            <li class="carrito mt-1 d-inline-flex">
              <span class="align-self-center">Cantidad:</span><input class="form-control mt-4 mb-4 ml-1 col" name="${i}"  type="number" min="1" value="${articulos[i].count}" onchange="updateCarrito(this.value, this.name)">
            </li>
            <li class="carrito d-flex justify-content-end">
              <h3 class="costoXcantidad">$${costo} ${articulos[i].currency}</h3>
            </li>
          </ul>
        </div>
      </div>
      <hr>
      `//armo el html necesario para que se repita en la lista
      document.getElementById("carrito-table").innerHTML = htmlAppend;
  }
}
function updateCarrito(cantidad, i){// creo la funcion para que se calcule el precio de uno o mas articulos cuando cambio cantidad
  let elementosCarrito = document.getElementsByClassName("carritoElem");// hago un array con cada articulo en el html
  let elementoSeleccionado = elementosCarrito[i];// obtengo el elemento del array que seleccionamos para cambiar
  articulos[i].count = cantidad;// traigo la cantidad del elemento con el mismo indice
  let costoXcantidad = cantidad * articulos[i].unitCost;//calculo nuevamente el costo por la cantidad
  elementoSeleccionado.getElementsByClassName("costoXcantidad")[0].innerHTML = `$${costoXcantidad} ${articulos[i].currency}`// inserto en el html del elemento seleccionado, el csoto por cantidad nuevo con el correspondiente currency
  updateSubtotal();// ejecuto las fuciones para cambiar el subtotal cuando se cambie la cantidad del carrito
  updateTipoEnvio()// tambien ejecuto esta funcion para ir cambiando los precios del costo del envio
}
function updateSubtotal(){//creo funcion para actualizar el subtotal
  subtotal = 0 // seteo cada vez que se ejecute la funcion en 0 si no se suma cada vez mas
  for(i=0; i < articulos.length; i++){
    subtotal += articulos[i].unitCost * articulos[i].count;// sumo todos los costos por cantidad
  }
  document.getElementById("txtSub").innerHTML = `$${subtotal} ${articulos[0].currency}`;// inserto en el html
}
function updateTipoEnvio(){// creo funcion para actualizar los precios del envio
  let tipoEnvio = document.getElementsByName("envio");// hago un array de los radio button creados para los tipo de envio
  let seleccionado;// creo una variable vacia para despues seleccionar un radio 
  tipoEnvio.forEach(function(element){// hago uso de un foreach para que al encontrar en el array el elemento checked
    if(element.checked){
      seleccionado = element.value;// y lo guardo en seleccionado
    }
  })
  let porcentaje = 0;
  switch(seleccionado){// utilizo un switch para que segun el elemento seleccionado de un porcentaje
    case "Premium":
      porcentaje = 0.15
    break;
    case "Express":
      porcentaje = 0.07
    break;
    case "Standard":
      porcentaje = 0.05
    break;
  }
  costoEnvio = parseInt(subtotal * porcentaje)// calculo el costo de envio
  document.getElementById("txtCostoEnvio").innerHTML = `$${costoEnvio} ${articulos[0].currency}`// cambio el html del costo
  document.getElementById("txtTipoEnvio").innerHTML = seleccionado// cambio el html del tipo de envio
  document.getElementById("txtTotal").innerHTML = `$${costoEnvio+subtotal} ${articulos[0].currency}`// cambio el Total de todo en el resumen de compra
}
function cambiarMoneda(mon){// creo un funcion para cambiar la moneda de los articulos
  if(mon == true){// si el valor del switch es true la moneda es igual a  "UYU"
    moneda = "UYU";
  }
  else{
    moneda = "USD";
  }
  for(i=0; i< articulos.length; i++){
    if(articulos[i].currency != moneda && articulos[i].currency === "UYU"){
      articulos[i].currency = "USD"
      articulos[i].unitCost = articulos[i].unitCost / 40
    }
    if(articulos[i].currency != moneda && articulos[i].currency === "USD"){
      articulos[i].currency = "UYU"
      articulos[i].unitCost = articulos[i].unitCost * 40
    }
  }
  mostrarCarrito()
  updateSubtotal()
  updateTipoEnvio()
}
function cambiarTexto(){
  if($("#tarjetaC")[0].checked){
    $("#FPtxt")[0].innerHTML = "💳Tarjeta de credito "
    document.forms["formModal"]["numT"].removeAttribute("disabled");
    document.forms["formModal"]["venc"].removeAttribute("disabled");
    document.forms["formModal"]["codSegu"].removeAttribute("disabled");
    document.forms["formModal"]["numCuenta"].setAttribute("disabled",true);
  }
  if($("#transferencia")[0].checked){
    $("#FPtxt")[0].innerHTML = "💵Tranferencia bancaria "
    document.forms["formModal"]["numT"].setAttribute("disabled",true);
    document.forms["formModal"]["venc"].setAttribute("disabled",true);
    document.forms["formModal"]["codSegu"].setAttribute("disabled",true);
    document.forms["formModal"]["numCuenta"].removeAttribute("disabled");
  }
}
// function validarModal(){
//   if($("#tarjetaC")[0].checked && document.forms["formModal"]["numT"].value != "" && document.forms["formModal"]["venc"].value != "" && document.forms["formModal"]["codSegu"].value != ""){

//   }
// }
(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();