import { hayItemsEnCarro } from "./utils.js"

document.addEventListener("DOMContentLoaded", function() {
    const IVA = 19
    let totalSinIVA = 0
    let contenedorBotones = document.getElementById("contenedorBotones")
    let carritoCompras = JSON.parse(localStorage.getItem("carrito")) || []
    let textoCarritoCompras = document.getElementById("textoCarritoCompras")
    let textoSinItems = document.getElementById("sinItemsEnCarrito")
    let tablaDatosTributarios = document.getElementById("tablaContenedorDatosTributarios")
    let tablaCarritoCompras = document.getElementById("tablaCarritoCompras")
    let tablaCuerpo = document.getElementsByTagName("tbody")[0]

    tablaCuerpo.innerHTML = ""

    if (hayItemsEnCarro()) {
        tablaDatosTributarios.style.display = "table"
        tablaCarritoCompras.style.display = "table"
        contenedorBotones.style.display = "block"
        textoCarritoCompras.style.display = "block"
        textoSinItems.style.display = "none"
    } else {
        tablaDatosTributarios.style.display = "none"
        tablaCarritoCompras.style.display = "none"
        contenedorBotones.style.display = "none"
        textoCarritoCompras.style.display = "none"
        textoSinItems.style.display = "block"
    }

    carritoCompras.forEach(function(juego) {
        let filaTabla = document.createElement("tr")
        let columnaImagen = document.createElement("td")
        let imagen = document.createElement("img")
        let descuentoOferta = juego.en_descuento ? parseInt(juego.descuento) : 0
        let descuentoTotal = descuentoOferta

        imagen.src = "/media/" + juego.imagen
        imagen.width = 35
        imagen.height = 35
        
        columnaImagen.style.textAlign = "center"
        columnaImagen.appendChild(imagen)
        filaTabla.appendChild(columnaImagen)

        let columnaNombre = document.createElement("td")
        columnaNombre.textContent = juego.nombre
        filaTabla.appendChild(columnaNombre)

        let columnaCategoria = document.createElement("td")
        columnaCategoria.textContent = juego.categoria
        filaTabla.appendChild(columnaCategoria)

        let columnaPrecio = document.createElement("td")
        columnaPrecio.textContent = "$" + (juego.precio * juego.cantidad)
        filaTabla.appendChild(columnaPrecio)

        let columnaDescuentoSub = document.createElement("td")
        columnaDescuentoSub.textContent = "$" + juego.precio_arriendo
        filaTabla.appendChild(columnaDescuentoSub)

        let columnaOferta = document.createElement("td")
        columnaOferta.textContent = juego.en_descuento ? "-" + descuentoOferta + "%" : "N/A"
        filaTabla.appendChild(columnaOferta)

        let columnaDescuentoTotal = document.createElement("td")
        columnaDescuentoTotal.textContent = descuentoTotal > 0 ? "-" + descuentoTotal + "%" : "N/A"
        filaTabla.appendChild(columnaDescuentoTotal)

        let columnaCantidad = document.createElement("td")
        columnaCantidad.textContent = juego.cantidad
        filaTabla.appendChild(columnaCantidad)

        let columnaPrecioFinal = document.createElement("td")
        columnaPrecioFinal.textContent = "$" + Math.trunc((juego.precio * juego.cantidad) * (1 - (descuentoTotal / 100)))
        filaTabla.appendChild(columnaPrecioFinal)

        let columnaBoton = document.createElement("td")
        let botonRemover = document.createElement("button")
        botonRemover.innerHTML = `<i class="bi bi-trash3"></i> Quitar</span>`
        botonRemover.classList.add("btn", "btn-danger")
        botonRemover.addEventListener("click", function() {
            removerItemDelCarrito(juego)
            location.reload()
        })
        columnaBoton.appendChild(botonRemover)
        filaTabla.appendChild(columnaBoton)

        tablaCuerpo.appendChild(filaTabla)

        totalSinIVA += Math.trunc((juego.precio * juego.cantidad) * (1 - (descuentoTotal / 100)))
    })

    let filaTablaDatosTrib = document.createElement("tr")
    let columnaPrecioSinIVA = document.createElement("td")
    let columnaIVA = document.createElement("td")
    let columnaTotalAPagar = document.createElement("td")

    columnaPrecioSinIVA.textContent = "$" + totalSinIVA
    columnaIVA.textContent = "+" + IVA + "%"
    columnaTotalAPagar.textContent = "$" + Math.trunc(totalSinIVA * ((IVA / 100) + 1))

    filaTablaDatosTrib.appendChild(columnaPrecioSinIVA)
    filaTablaDatosTrib.appendChild(columnaIVA)
    filaTablaDatosTrib.appendChild(columnaTotalAPagar)
    tablaDatosTributarios.appendChild(filaTablaDatosTrib)
})

function removerItemDelCarrito(juego) {
    let carritoCompras = JSON.parse(localStorage.getItem("carrito")) || []
    carritoCompras = carritoCompras.filter(function(item) {
        return item.nombre !== juego.nombre
    })
    localStorage.setItem("carrito", JSON.stringify(carritoCompras))
}

export async function limpiarCarrito() {
    localStorage.removeItem("carrito")
    location.reload()
}
