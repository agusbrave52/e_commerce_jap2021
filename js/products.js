const ORDER_ASC_BY_COST = "19";
const ORDER_DESC_BY_COST = "91";
const ORDER_BY_PROD_COUNT = "Rel.";
var currentProductArray = [];
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;
var productos = [];

function showProductList() {
    let htmlContentToAppend = "";
    //creamos un for para mostrar la lista de productos
    for (let i = 0; i < currentProductArray.length; i++) {
        let product = currentProductArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(product.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(product.cost) <= maxCount))) {
            htmlContentToAppend += `
            <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                <a href="product-info.html" class="list-group-item-action">
                    <div class="card">
                        <img src="${product.imgSrc}" alt="${product.description}" class="img-thumbnail">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description} </p><h4>${product.cost} ${product.currency}</h4>
                            <span class="d-flex justify-content-end">${product.soldCount} artículos</span>
                        </div>
                    </div>
                </a>
            </div>
            `; //Agrego el precio que le faltaba
        }
        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }
}
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(response => {//usamos el getJSONData para traer los datos de los productos
        if (response.status === "ok") {
            sortAndShowProducts(ORDER_ASC_BY_COST, response.data);//usamos la funcion para traer los productos ya ordenados
            productos = response.data
        }
    });
})

function mostrar() { //Creo una funcion para desplegar los filtros
    $("#filtros").slideToggle(400); //Hago uso de la funcion slideToggle para alternar entre esconder y mostrar los filtros
}

function updateTextRange(val, id) { //Creo una funcion para cambiar el valor del texto del rango
    let rangoMax = document.getElementById("rangeFilterCountMax");
    let rangoMin = document.getElementById("rangeFilterCountMin");

    document.getElementById(id).innerHTML = val; //Inserto el valor en el texto

    if (rangoMax.oninput) { //Esto es para que el rango minimo nunca supere al maximo
        rangoMin.max = rangoMax.value;
        document.getElementById("textRange1").innerHTML = rangoMin.value;
    }
}

function sortProducts(criteria, array) { //funcion que ordena una lista dada segun el criterio dado y devuelve una lista
    let result = [];
    if (criteria === ORDER_ASC_BY_COST) {
        result = array.sort(function (a, b) {
            if (a.cost < b.cost) { return -1; }
            if (a.cost > b.cost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_COST) {
        result = array.sort(function (a, b) {
            if (a.cost > b.cost) { return -1; }
            if (a.cost < b.cost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_PROD_COUNT) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if (aCount > bCount) { return -1; }
            if (aCount < bCount) { return 1; }
            return 0;
        });
    }
    return result;
}

function sortAndShowProducts(sortCriteria, productsArray) {//funcion que ordena los productos y los muestra segun un criterio dado
    currentSortCriteria = sortCriteria;

    if (productsArray != undefined) {
        currentProductArray = productsArray;
    }

    currentProductArray = sortProducts(currentSortCriteria, currentProductArray);

    //Muestro las categorías ordenadas
    showProductList();
}

document.getElementById("sortAsc").addEventListener("click", function () {//ordeno la lista segun criterio ASC
    sortAndShowProducts(ORDER_ASC_BY_COST);
});

document.getElementById("sortDesc").addEventListener("click", function () {//ordeno la lista segun criterio DESC
    sortAndShowProducts(ORDER_DESC_BY_COST);
});

document.getElementById("sortByCount").addEventListener("click", function () {//ordeno la lista segun criterio COUNT
    sortAndShowProducts(ORDER_BY_PROD_COUNT);
});

document.getElementById("clearRangeFilter").addEventListener("click", function () {//funcion para limpiar la parte de filtros
    document.getElementById("rangeFilterCountMin").value = 0;
    document.getElementById("rangeFilterCountMax").value = 0;
    document.getElementById("textRange1").innerHTML = 0;
    document.getElementById("textRange2").innerHTML = 0;
    minCount = undefined;
    maxCount = undefined;

    showProductList();
});

document.getElementById("rangeFilterCount").addEventListener("click", function () {//funcion para filtrar y mostrar la lista de productos
    //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
    //de productos por categoría.
    minCount = document.getElementById("rangeFilterCountMin").value;
    maxCount = document.getElementById("rangeFilterCountMax").value;

    showProductList();
});

function buscar(value){//creo la funcion buscar que muestra los productos encontrados tras ingresar una letra
    if(value){// Si no esta vacio
        const llave = ['name', 'description'];
        let listaBuscada = buscarLlaves(productos, llave, value.toLowerCase());//guardo en una variable un array con los productos encontrados
        if(listaBuscada.length == 0){//valida si encuentra algo
            document.getElementById("prod-list-container").innerHTML = "";//si no encuentra nada deja los productos vacios
        }
        sortAndShowProducts(currentSortCriteria, listaBuscada);//muestro el nuevo array con los productos encontrados
    }
    else{
        sortAndShowProducts(currentSortCriteria, productos);//si no muestro el array de los productos completo
    }
}
   
function buscarLlaves( lista, llave, letra ){//creo funcion para retornar un array con los productos encotrados tras la busqueda
    let array = [];
    llave.forEach((key) =>{// Recorrer llaves de busqueda
        lista.forEach((list) =>{// Recorrer la lista
            if (list[key].toLowerCase().includes(letra)){// validar si el indice tiene un valor semejante
                if (array.indexOf(list) < 0 ){// validar si ya existe en el arreglo
                    array.push(list);//meto en el array nuevo los productos encontrados
                }
            }
        });
    });
    return array;//devuelvo el array ya con los productos encontrados
}