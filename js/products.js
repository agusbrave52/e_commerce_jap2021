//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
function showProductList(currentProductArray){//la funcion recibe una lista la cual le damos el valor del response.data
    let htmlContentToAppend = "";
    //creamos un for para mostrar la lista de productos
    for(let i = 0; i < currentProductArray.length; i++){
        let product = currentProductArray[i];
            htmlContentToAppend += `
            <a href="product-info.html" class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="${product.imgSrc}" alt="${product.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${product.name}</h4>
                            <small class="text-muted">${product.soldCount} artículos</small>
                        </div>
                        <p class="mb-1">${product.description}</p>
                        <small>${product.cost} ${product.currency}</small>
                    </div>
                    
                </div>
            </a>
            `; //Agrego el precio que le faltaba
        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }
}
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(response => {//usamos el getJSONData para traer los datos de los productos
        showProductList(response.data);
    });
    
});