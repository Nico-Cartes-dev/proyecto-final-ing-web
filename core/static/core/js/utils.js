const btnCarritoCompras = document.getElementById("btnCarritoCompras")
const contadorCarritoCompras = document.getElementById("contadorCarritoCompras")

//Mostrar menú para buscar juegos
/* document.addEventListener("keydown", function(event) {
	if ((event.ctrlKey || event.metaKey) && (event.key === "k" || event.key === "K")) {
		event.preventDefault()
		var modalHTML = document.getElementById("modalBusqueda")
		var modalHTMLFicha = document.getElementById("modalFichaProducto")
		if (!modalHTML.classList.contains("show") && !modalHTMLFicha.classList.contains("show")) {
			var modalInstance = new bootstrap.Modal(modalHTML)
			modalInstance.show()
		}
	}
}) */

//Carrito de compras
export function agregarAlCarrito(juego) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

	const juegoEnCarrito = carrito.find(o_jogo => juego.nombre === o_jogo.nombre)
	if (juegoEnCarrito) {
		juegoEnCarrito.cantidad++
	} else {
		juego.cantidad = 1
		carrito.push(juego);
	}
    localStorage.setItem('carrito', JSON.stringify(carrito));
/* 	actualizarBotonCarrito() */
}

export function getCantidadItemsCarrito() {
	const carrito = JSON.parse(localStorage.getItem("carrito")) || []
	return carrito.length
}

export function hayItemsEnCarro() {
	const carrito = JSON.parse(localStorage.getItem("carrito")) || []
	return carrito.length > 0
}

/* export function actualizarBotonCarrito() {
	if (btnCarritoCompras != null && contadorCarritoCompras != null) {
		if (hayItemsEnCarro()) {
			btnCarritoCompras.style.display = "block"
			contadorCarritoCompras.style.display = "block"
		} else {
			btnCarritoCompras.style.display = "none"
			contadorCarritoCompras.style.display = "none"
		}
		contadorCarritoCompras.textContent = getCantidadItemsCarrito()
	}
} */

/* function actualizarInterfazUsuario() {
    // Actualizar el contador de elementos en el carrito en el navbar, por ejemplo
    const carritoCount = document.getElementById('cuenta-carrito');
    let cantidad = JSON.parse(localStorage.getItem('carrito')).length || 0;
    carritoCount.textContent = cantidad;
} */
//Carrito de compras

//Obtener los datos de los juegos.
export async function getProductosData(id = 0) {
	try {
		const respuesta = id > 0 ? await fetch(`/api/productos/?id=${id}`) : await fetch("/api/productos/")
		if (!respuesta.ok) {
			throw new Error(`HTTP Error Status: ${respuesta.status}`)
		}
		const datos = await respuesta.json()
		return datos
	} catch (error) {
		console.error("No se pueden obtener los datos de los productos: ", error)
		return []
	}
}

//Crear las tarjetas de los productos.
export async function crearTarjetaProducto(producto, i) {
	let badge

	if (producto.stock > 0) {
		badge = `<span class="badge text-bg-success">Disponible</span>`;
		if (producto.en_descuento) {
			badge += ` <span class="badge text-bg-info">Oferta</span>`;
		}
	} else if (producto.stock === 0 & producto.en_restock) {
		badge = `<span class="badge text-bg-warning">Re-Stock en curso</span>`;
	} else {
		badge = `<span class="badge text-bg-danger">Agotado</span>`;
	}

	let tarjetaProducto = `
		<div class="col col-sm-12 col-md-6 col-lg-4 col-xl-3 d-flex justify-content-center align-items-center" style="margin-bottom: 25px">
			<div class="card" id="carta-producto" style="width: 350px">
				${producto.en_descuento ? `
					<div class="position-absolute top-0 end-0 p-2 text-center" style="margin: -12px;">
						<i class="bi bi-fire fs-1" id="icon-flama"></i>
						<div style="font-size: 0.65rem;">Destacado</div>
					</div>` : ''}
				<img src="media/${producto.imagen}" style="height: 250px; width: 250px; margin-top: 1.5rem;" class="card-img-top mx-auto d-block">
				<div class="card-body">
					<h5 class="card-title text-center">${producto.nombre}</h5>
					<h5>
						<p class="card-text text-center">
							${badge}
						</p>
					</h5>
					<p>
						<b>Precio:</b> <span class="text-success-emphasis">$${producto.precio}</span><br>
						<b>Stock:</b> <span class="text-warning-emphasis">${producto.stock}</span><br>
					</p>
				</div>
				<div class="card-footer text-center">
					<button class="btn btn-custom-outline mx-2" type="button" id="verFicha${i}"><i class="bi bi-file-earmark-text"></i> Ver ficha</button>
					<button class="btn btn-outline-warning mx-2" type="button" id="favorito${i}" data-id="${producto.id}"><i class="bi bi-heart"></i> Favoritos</button>
				</div>
			</div>
		</div>
		`;
	return tarjetaProducto
}

//Mostrar ficha producto
export async function mostrarFichaProducto(juegosEnPagina, i) {
	var modalHTML = document.getElementById("modalFichaProducto")
	if (!modalHTML.classList.contains("show")) {
		var modalInstance = new bootstrap.Modal(modalHTML)
		var juego = juegosEnPagina[i] 
		let precioOfertaHTML = ""
		let precioAnteriorHTML = "<span id='juego-precio-anterior'>   </span>"
		let porcentajeDescuentoHTML = ""
		let badge;

		if (juego.stock > 0) {
			badge = `<span class="badge text-bg-success">Disponible</span>`;
			if (juego.en_descuento) {
				badge += ` <span class="badge text-bg-info">Oferta</span>`;
			}
		} else if (juego.stock === 0 & juego.en_restock) {
			badge = `<span class="badge text-bg-warning">Re-Stock en curso</span>`;
		} else {
			badge = `<span class="badge text-bg-danger">Agotado</span>`;
		}

		if (juego.en_descuento) {
			porcentajeDescuentoHTML = `<span id="juego-descuento">(-${juego.descuento}%)</span>`
			precioOfertaHTML = `<span class="text-success-emphasis">$${juego.precio}</span>`
			precioAnteriorHTML = `<span class="text-warning-emphasis">$${Math.trunc(juego.precio * (1 - (juego.descuento / 100)))}</span>` 
		}
		let tarjetaJuego = `
		<div class="card mb-3 h-100" style="max-width: 100%;">
			<div class="row g-0">
				<div class="col-md-4">
					<img src="media/${juego.imagen}" class="img-fluid rounded-start">
				</div>
				<div class="col-md-8 d-flex flex-column">
					<div class="card-body">
						<h5 class="card-title">${juego.nombre}</h5>
						<p>${badge}</p>
						<p class="card-text">${juego.descripcion}</p>
					</div>
					<div class="card-footer text-center mt-auto">
						<b>Precio:</b> <span class="text-success-emphasis">$${juego.precio}</span> • <b>Oferta:</b> ${precioAnteriorHTML} ${porcentajeDescuentoHTML} • <b>Stock:</b> <span class="text-warning-emphasis">${juego.stock}</span>
					</div>
				</div>
			</div>
		</div>
		`
		var modalHeader = document.getElementById("modalFichaProductoHeader")
		var modalBody = document.getElementById("modalFichaProductoBody")
		var modalFooter = document.getElementById("modalFichaProductoFooter")
		modalHeader.innerHTML = `
		<button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
		`
		modalBody.innerHTML = tarjetaJuego
		modalFooter.innerHTML = `
		<button class="btn btn-success mx-2 ${juego.stock === 0 ? 'disabled' : ''}" type="submit" id="searchToastBuy${i}"><i class="bi bi-cart"></i> Añadir al carrito</button>
		<button class="btn btn-success mx-2 ${juego.stock === 0 ? 'disabled' : ''}" type="submit" id="searchToastBuyNow${i}"><i class="bi bi-cash-stack"></i> Comprar ahora</button>
		<button class="btn btn-warning mx-2" type="submit" id="searchToastFav${i}"><i class="bi bi-heart"></i> Favoritos</button>
		`

		var btnAñadirCarrito = document.getElementById(`searchToastBuy${i}`)
		var btnComprarAhora = document.getElementById(`searchToastBuyNow${i}`)
		var btnAñadirFavorito = document.getElementById(`searchToastFav${i}`)

		btnAñadirCarrito.addEventListener("click", function() {
			sendToast("Juego agregado al carrito de compras", `Agregaste ${juego.nombre}.`, "success-subtle");
			agregarAlCarrito(juego);
		})

		btnComprarAhora.addEventListener("click", function() {
			sendToast("Juego comprado", `Se compró ${juego.nombre}.`, "success-subtle")
		})

		btnAñadirFavorito.addEventListener("click", function() {
			sendToast("Añadido a favoritos", `¡Añadiste ${juego.nombre} a tus favoritos!`, "warning-subtle");
		})

		modalInstance.show()
	}
}

//Mostrar toasts
export function sendToast(titulo, cuerpo, tipo = "success") {
	var toastElement = document.createElement("div")
	toastElement.classList.add("toast")
	toastElement.classList.add("toast-fadeout")
	toastElement.setAttribute("role", "alert")
	toastElement.setAttribute("aria-live", "assertive")
	toastElement.setAttribute("aria-atomic", "true")
	toastElement.classList.add("bg-" + tipo)
	toastElement.innerHTML = `
		<div class="toast-header">
			<strong class="me-auto">${titulo}</strong>
			<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
		</div>
		<div class="toast-body">
			${cuerpo}
		</div>
	`
	document.getElementById("toastContainer").appendChild(toastElement)
	var toast = new bootstrap.Toast(toastElement)
	toast.show()
	toastElement.addEventListener("hidden.bs.toast", function() {
		toastElement.remove()
	})
}


//Formatear fechas
export function formatearFecha(fecha) {
	const date = new Date(fecha)
	const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]
	const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]

	const numDia = date.getDate()
	const nombreMes = meses[date.getMonth()]
	const año = date.getFullYear()
	const horas = date.getHours().toString().padStart(2, "0")
	const minutos = date.getMinutes().toString().padStart(2, "0")

	return `${numDia} de ${nombreMes} de ${año} a las ${horas}:${minutos}`
}

export function getCookie(name, doc) {
	let cookieValue = null;
	if (doc.cookie && doc.cookie !== '') {
		const cookies = doc.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			if (cookie.startsWith(name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

//=================================================================================