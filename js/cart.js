//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
let articulos = [];
let moneda;
let subtotal = 0;
let costoEnvio = 0;
document.addEventListener("DOMContentLoaded", function(e){
  getJSONData("./generated.json").then(function(response){
    if(response.status === "ok"){
      articulos = response.data.articles;
      mostrarCarrito()
      updateSubtotal()
      updateTipoEnvio()
      cambiarMoneda(true)
    }
  })
});
function mostrarCarrito(){
  let htmlAppend = "";
  for(i=0; i<articulos.length; i++){
      let costo = articulos[i].unitCost * articulos[i].count;
      htmlAppend +=`
      <div class="row carritoElem">
        <div class="d-flex col-2 border justify-content-center ">
          <img src="${articulos[i].src}" alt="" class="w-100">
        </div>
        <div class="d-flex col border">
          <span class="align-self-center">${articulos[i].name}</span>
        </div>
        <div class="d-flex col border text-center">
          <span class="align-self-center">Cantidad:</span><input class="form-control mt-4 mb-4 ml-1 col" name="${i}"  type="number" min="1" value="${articulos[i].count}" onchange="updateCarrito(this.value, this.name)">
        </div>
        <div class="d-flex col border">
          <span class="align-self-center costoXcantidad">$${costo} ${articulos[i].currency}</span>
        </div>
      </div>
      `
      document.getElementById("carrito-table").innerHTML = htmlAppend;
  }
}
function updateCarrito(cantidad, i){
  let elementosCarrito = document.getElementsByClassName("carritoElem");
  let elementoSeleccionado = elementosCarrito[i];
  articulos[i].count = cantidad;
  let costoXcantidad = cantidad * articulos[i].unitCost;
  elementoSeleccionado.getElementsByClassName("costoXcantidad")[0].innerHTML = `$${costoXcantidad} ${articulos[i].currency}` 
  updateSubtotal();
  updateTipoEnvio()
}
function updateSubtotal(){
  subtotal = 0
  for(i=0; i < articulos.length; i++){
    subtotal += articulos[i].unitCost * articulos[i].count;
  }
  document.getElementById("txtSub").innerHTML = `$${subtotal} ${articulos[0].currency}`;
}
function updateTipoEnvio(){
  let tipoEnvio = document.getElementsByName("envio");
  let seleccionado;
  tipoEnvio.forEach(function(element){
    if(element.checked){
      seleccionado = element.value;
    }
  })
  let porcentaje = 0;
  switch(seleccionado){
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
  costoEnvio = parseInt(subtotal * porcentaje)
  document.getElementById("txtCostoEnvio").innerHTML = `$${costoEnvio} ${articulos[0].currency}`
  document.getElementById("txtTipoEnvio").innerHTML = seleccionado
  document.getElementById("txtTotal").innerHTML = `$${costoEnvio+subtotal} ${articulos[0].currency}`
}
function cambiarMoneda(mon){
  if(mon == true){
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