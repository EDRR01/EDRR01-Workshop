import { Producto } from "./entities/Producto.js";
import { ElementoCarrito } from "./entities/ElementoCarrito.js";

/**
 * Definiciones de constantes
 */
 const estandarDolaresAmericanos = Intl.NumberFormat('en-US');

 /**
  * Crear el arreglo de Productos y de ElementosCarrito
  */
const productos = [];
const elementosCarrito = [];

/**
 * Variables que hacen referencia a contenedores y botones en el DOM
 */
const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorCarritoCompras = document.getElementById("bodyCarrito");
const contenedorFooterCarrito = document.getElementById("footerCarrito");

const botonFinalizarCompra = document.getElementById("boton-finalizar-compra");

/**
 * Definicion de funciones
 */

/**
 * Se encarga de cargar los productos. En este momento es estático, pero la idea es hacert una carga dinámica.
 */
const cargarProductos = () => {
    /*productos.push(new Producto(1, 'Muffin', 1.99, './img/muffin.jpg', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum imperdiet nisi felis, et mollis massa posuere eu. Phasellus id accumsan. '));
    productos.push(new Producto(3, 'Brownie', 4.23, './img/brownie.jpg', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum imperdiet nisi felis, et mollis massa posuere eu. Phasellus id accumsan. '));
    productos.push(new Producto(2, 'Pastel de Bodas', 1256.96, './img/wedding_cake.jpg', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum imperdiet nisi felis, et mollis massa posuere eu. Phasellus id accumsan. '));
    productos.push(new Producto(4, 'Chocotorta', 80.98, './img/chocotorta.jpg', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum imperdiet nisi felis, et mollis massa posuere eu. Phasellus id accumsan. '));
    productos.push(new Producto(5, 'Pay de limón', 23.98, './img/pay_limon.png', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum imperdiet nisi felis, et mollis massa posuere eu. Phasellus id accumsan. '));
    productos.push(new Producto(6, 'Croissant', 23.98, './img/croissant.jpg', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum imperdiet nisi felis, et mollis massa posuere eu. Phasellus id accumsan. '));
    productos.push(new Producto(7, 'Creme brulee', 23.98, './img/creme_brule.jpg', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum imperdiet nisi felis, et mollis massa posuere eu. Phasellus id accumsan. '));
    productos.push(new Producto(8, 'Flan', 23.98, './img/flan.jpg', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum imperdiet nisi felis, et mollis massa posuere eu. Phasellus id accumsan. '));
    */

    fetch('./js/data/productos.json')
        .then(response => response.json())
        .then(productosJson => {
            //console.info("productosJson", productosJson);

            productosJson.forEach(elementoJson => {
                productos.push(
                    new Producto(elementoJson.id, 
                        elementoJson.nombre, elementoJson.precio, elementoJson.urlFoto, 
                        elementoJson.descripcion));
            });
        })
        .then(() => {
            cargarElementosCarritoCompras();
            dibujarCatalogoProductos();
            dibujarCarritoCommpras();
        })
        .catch(error => {
            Swal.fire({
                title: "Imposible realizar la carga",
                text: `Este es el error recibifo: ${error}`,
                icon: "error"
              })
        })
        .finally(() => {
            console.info("Intento de carga finalizado");
        });
}

const crearEventoAgregarProducto = (producto) => {
    const evento = (ev) => {

        let elemento = new ElementoCarrito(producto, 1);
        elementosCarrito.push(elemento);

        let elementosCarritoJson = JSON.stringify(elementosCarrito);
        localStorage.setItem('carritoCompras', elementosCarritoJson);

        dibujarCarritoCommpras();
        
        Swal.fire({
            title: "¡Producto Agregado!",
            text: `${producto.nombre} agregado al carrito con éxito.`,
            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ir a carrito",
            cancelButtonText: "Cerrar"

          }).then((result) => {
            if(result.isConfirmed) {
                console.info("Vamos al carrito");
                const divCarritoCompras = document.getElementById('carritoCompras');
                const modalCarrito = new bootstrap.Modal(divCarritoCompras,  {
                    keyboard: true
                  });
                const modalToggle = document.getElementById('botonAbrirCarrito'); 
                modalCarrito.show(modalToggle);
            }
            
          });

          console.info("Elementos de Carrito de Compras: ", elementosCarrito);
    }

    return evento;
}

const crearCardProducto = (producto) => {
    //Botón de compra
    let botonAgregar = document.createElement("button");
    botonAgregar.classList.add("btn");
    botonAgregar.classList.add("btn-success");
    botonAgregar.innerText = "Comprar";
    botonAgregar.onclick = crearEventoAgregarProducto(producto);

    //Footer
    let pieCard = document.createElement("div");
    pieCard.className = "card-footer text-end";
    pieCard.appendChild(botonAgregar);

    //Imagen
    let imagenProducto = document.createElement("img");
    imagenProducto.src = producto.urlFoto;
    imagenProducto.className = "card-img-top";
    imagenProducto.alt = producto.nombre;

    //Cuerpo Card
    let cuerpoCard = document.createElement("div");
    cuerpoCard.className = "card-body";
    cuerpoCard.innerHTML = `
        <h5 class="card-title">${producto.nombre}</h5>
        <h6 class="card-subtitle mb-2 text-body-secondary">Precio: $ ${
            estandarDolaresAmericanos.format(producto.precio)
        } USD</h6>
        <p class="card-text">${producto.descripcion}</p>
    `;

    //Card
    let card = document.createElement("div");
    card.className = 'card h-100';
    card.append(imagenProducto);
    card.append(cuerpoCard);
    card.append(pieCard);

    //Col
    let celda = document.createElement("div");
    celda.className = "col";
    celda.appendChild(card);

    return celda;

}

/**
 * Se encargará de recorrer la lista de productos y agregar un componente Card con la info del producto al contenedor de elementos.
 */
const dibujarCatalogoProductos = () => {
    contenedorProductos.innerHTML = "";

    productos.forEach(producto => {
        let contenedorCarta = crearCardProducto(producto);
        contenedorProductos.append(contenedorCarta)
    });

}

const cargarElementosCarritoCompras = () => {
    if(localStorage.getItem("carritoCompras")) {
        let carritoComprasJson = JSON.parse(localStorage.getItem("carritoCompras"));

        carritoComprasJson.forEach(elemento => {
            let producto = new Producto(
                elemento.producto.id,
                elemento.producto.nombre,
                elemento.producto.precio,
                elemento.producto.urlFoto,
                elemento.producto.descripcion);

            let elementoCarrito = new ElementoCarrito(producto, elemento.cantidad);

            elementosCarrito.push(elementoCarrito);
        });

    }
}

const dibujarCarritoCommpras = () => {
    contenedorCarritoCompras.innerHTML = "";

    let sumaCarrito = 0;

    // Aquí escribimos el body!
    elementosCarrito.forEach(elemento => {
        let renglonCarrito = document.createElement("tr");

        renglonCarrito.innerHTML = `
        <th scope="row">${elemento.producto.id}</th>
        <td>${elemento.producto.nombre}</td>
        <td><input id="cantidad-producto-${elemento.producto.id}" 
                type="number" value="${elemento.cantidad}" 
                min="1" max="1000" step="1" class="caja-cantidad-producto"/></td>
        <td>$ ${estandarDolaresAmericanos.format(elemento.producto.precio)}</td>
        <td>$ ${estandarDolaresAmericanos.format(elemento.cantidad*elemento.producto.precio)}</td>
        `;

        contenedorCarritoCompras.append(renglonCarrito);

        let inputCantidadProducto = document.getElementById(`cantidad-producto-${elemento.producto.id}`);
        inputCantidadProducto.onchange = (ev) => {
            //console.log("Cantidad de elemento: ", `cantidad-producto-${elemento.producto.id}`, 'ha cambiado!');
            let nuevaCantidad = ev.target.value;
            elemento.cantidad = nuevaCantidad;
            dibujarCarritoCommpras();

            let elementosCarritoJson = JSON.stringify(elementosCarrito);
            localStorage.setItem('carritoCompras', elementosCarritoJson)
        }

        //sumaCarrito = sumaCarrito +
        sumaCarrito+=elemento.cantidad*elemento.producto.precio;
    });

    //Aquí escribimos el footer
    if(elementosCarrito.length == 0) {
        contenedorFooterCarrito.innerHTML = 
            `Carrito vacío!!! Empieza a comprar!!!`;
    } else {
        contenedorFooterCarrito.innerHTML = 
            `Total de la compra: $ ${estandarDolaresAmericanos.format(sumaCarrito)}`;
    }
}

const finalizarCompra = () => {
    Swal.fire({
        title: "¡Compra exitosa!",
        text: "Tu pedido llegará en un máximo de 2 horas.",
        icon: "success"
    });    

    elementosCarrito.splice(0, elementosCarrito.length);
    dibujarCarritoCommpras();

    localStorage.removeItem("carritoCompras");
}


/**
 * Ejecución de funciones
 */
cargarProductos();

/**
 * Asignar eventos
 */

botonFinalizarCompra.onclick = finalizarCompra;