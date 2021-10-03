//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
let comentariosCargados = [];
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCT_INFO_URL).then(function(resultObj){//hago un getJSONData de la info de productos
        if (resultObj.status === "ok")
        {
            infoProduct = resultObj.data;

            let productNameHTML  = document.getElementsByClassName("productName");//obtengo items del html
            let productDescriptionHTML = document.getElementById("productDescription");
            let productCountHTML = document.getElementById("soldCount");
            let productPrice = document.getElementById("price");
            let categoryProd = document.getElementById("categoryProd");
        
            productNameHTML[0].innerHTML = infoProduct.name;//y les pongo el valor que ya traen desde el JSON
            productNameHTML[1].innerHTML = infoProduct.name;
            productDescriptionHTML.innerHTML = infoProduct.description;
            productCountHTML.innerHTML = infoProduct.soldCount;
            productPrice.innerHTML = `$${infoProduct.cost} ${infoProduct.currency}`
            categoryProd.innerHTML = infoProduct.category;

            showImagesCarousel(infoProduct.images);//uso la funcion para traer las imagenes a travez de el array de imagenes

            getJSONData(PRODUCTS_URL).then(function(promise){//Traigo otro JSON para combinar los dos en los productos realcionados
                if(promise.status === "ok"){
                    producto = promise.data;
        
                    let htmlContentToAppend = "";
                    for(i = 0; i < infoProduct.relatedProducts.length; i++){
                        htmlContentToAppend +=`
                        <div class="card d-inline-block align-top" style="width: 18rem;">
                            <img src="img/prod${infoProduct.relatedProducts[i]+1}.jpg" class="card-img-top" alt="">
                            <div class="card-body">
                                <h5 class="card-title" id="titleCard">${producto[infoProduct.relatedProducts[i]].name}</h5>
                                <p class="card-text" id="descriptionCard">${producto[infoProduct.relatedProducts[i]].description}</p>
                                <a href="#" class="btn btn-primary">Ver</a>
                            </div>
                        </div>
                        `;
                        document.getElementById("productosRelacionados").innerHTML = htmlContentToAppend;
                    }
                }
            })
        }
    });
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){
        if(resultObj.status === "ok"){
            comentariosCargados = resultObj.data;
            mostrarComentarios()
        }
    })
    
});
function estrellas(cant){//Esta funcion tiene un for que llega hasta 5 y unos if que controlan que segun el
                         //score de los comentarios(cant) inserte una estrella checked o normal
                         //y retorna un texto con el html ya pronto
    let htmlContentToAppend = "";
    for(let i = 0; i < 5; i++){
        if(i < cant){
            htmlContentToAppend += `
            <span class="fa fa-star checked"></span>
            `
        }
        else{
            htmlContentToAppend += `
            <span class="fa fa-star"></span>
            `
        }
    }
    return htmlContentToAppend;
}
function showImagesCarousel(array){//Esta funcion ingresa las imagenes para el carosuel en formato HTML

    let htmlContentToAppend = "";

    for(let i = 0; i < array.length; i++){  //y meto en html la parte que faltaba del carousel de imagenes
        let imageSrc = array[i];
        if(i == 0){ //con este if me fijo si es la primera vez que pasa por el for para dejar un item del carousel como 'active'
            htmlContentToAppend += `
        <div class="carousel-item active">
            <img src=${imageSrc} class="d-block w-100 rounded-circle" alt="Imagen${i}">
        </div>
        `
        }
        else{ //luego sigo ingresando todo de manera normal sin 'active'
            htmlContentToAppend += `
            <div class="carousel-item">
                <img src=${imageSrc} class="d-block w-100 rounded-circle" alt="Imagen${i}">
            </div>
            `
        }
        document.getElementById("productImagesGallery").innerHTML = htmlContentToAppend;
    }
}
function mostrarComentarios(){
    //En los comentarios creo toda una seccion por cada comentario, donde segun la variable "comentariosCargados" y el
    //indice "i" del for va metiendo la info de la promesa traida
    let htmlContentToAppend = "";
            for(i = 0; i < comentariosCargados.length; i++){
                htmlContentToAppend += `
                <div class="row" style="background-color: rgb(210, 239, 248); border: rgb(118, 153, 165) 1px solid;">
                    <dl class="w-100 p-3">
                        <strong class="text-primary">User: ${comentariosCargados[i].user}</strong>
                        <span class="text-right">${comentariosCargados[i].dateTime}</span><br>
                        <span class="text-warning">Puntaje: </span>${estrellas(comentariosCargados[i].score)}
                        <dd>
                            <span><strong>Comentario: </strong>${comentariosCargados[i].description}</span>
                            
                        </dd>
                    </dl>
                </div>
                `;
                document.getElementById("cajaComentarios").innerHTML = htmlContentToAppend;
            }
}
function comentar(){//FUNCION PARA ARMAR UN COMENTARIO EN FORMA DE OBJETO Y AGREGARLO A LA LISTA DE COMENTARIOS ANTES GUARDADA
    let nuevoComentario = {
        "score":$("input:radio[name=estrellas]:checked").val(),
        "description":$("#newComment").val(),
        "user":sessionStorage.getItem("Usuario"),
        "dateTime": fecha()
    }
    comentariosCargados.push(nuevoComentario);
    mostrarComentarios();
    $("#formulario").trigger("reset");
}
function fecha(){//FUNCION QUE DEVUELVE UN STRING ARMADO CON LA FECHA EN EL FORMATO DESEADO
    let hoy = new Date();
    return `${hoy.getFullYear().toString().padStart(2,"0")}-${(hoy.getMonth() + 1).toString().padStart(2,"0")}-${hoy.getDate().toString().padStart(2,"0")} ${hoy.getHours().toString().padStart(2,"0")}:${hoy.getMinutes().toString().padStart(2,"0")}:${hoy.getSeconds().toString().padStart(2,"0")}`;
}



