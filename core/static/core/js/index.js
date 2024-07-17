//=================================================================================
import { getProductosData, mostrarFichaProducto, crearTarjetaProducto } from "./utils.js"
//=================================================================================
const productos = await getProductosData()
const productosPorPagina = 12
let paginaActual = 1
let filtroPrecio = "none"
let filtroAlfabetico = "none"

const listaProductosOriginal = Object.values(productos)
const campoBusqueda = document.getElementById("campo_busqueda")

const precioDescSwitch = document.getElementById("precioDescendente")
const precioAscSwitch = document.getElementById("precioAscendente")
const ordenAZSwitch = document.getElementById("alfabetoDescendente")
const ordenZASwitch = document.getElementById("alfabetoAscendente")
//=================================================================================
campoBusqueda.addEventListener("input", () => {
	mostrarProductos(paginaActual, filtroPrecio, filtroAlfabetico)
})

precioDescSwitch.addEventListener("change", function() {
	precioAscSwitch.checked ? precioAscSwitch.checked = false : null
	if (!precioAscSwitch.checked && !precioDescSwitch.checked) {
		mostrarProductos(paginaActual, "none", filtroAlfabetico)
		return
	}
	mostrarProductos(paginaActual, "desc", filtroAlfabetico)
})

precioAscSwitch.addEventListener("change", function() {
	precioDescSwitch.checked ? precioDescSwitch.checked = false : null
	if (!precioDescSwitch.checked && !precioAscSwitch.checked) {
		mostrarProductos(paginaActual, "none", filtroAlfabetico)
		return
	}
	mostrarProductos(paginaActual, "asc", filtroAlfabetico)
})

ordenAZSwitch.addEventListener("change", function() {
	ordenZASwitch.checked ? ordenZASwitch.checked = false : null
	if (!ordenZASwitch.checked && !ordenAZSwitch.checked) {
		mostrarProductos(paginaActual, filtroPrecio, "none")
		return
	}
	mostrarProductos(paginaActual, filtroPrecio, "desc")
})

ordenZASwitch.addEventListener("change", function() {
	ordenAZSwitch.checked ? ordenAZSwitch.checked = false : null
	if (!ordenAZSwitch.checked && !ordenZASwitch.checked) {
		mostrarProductos(paginaActual, filtroPrecio, "none")
		return
	}
	mostrarProductos(paginaActual, filtroPrecio, "asc")
})
//=================================================================================

//Añadir las cartas de los juegos a la página.
async function mostrarProductos(pagina, ordenPrecios = "none", ordenAlfabetico = "none") {
	let listaProductosFiltrados = [...listaProductosOriginal]
	filtroPrecio = ordenPrecios
	filtroAlfabetico = ordenAlfabetico

	const busqueda = campoBusqueda.value.trim().toLowerCase()
	if (busqueda !== "") {
		listaProductosFiltrados = listaProductosFiltrados.filter(producto => {
			return producto.nombre.toLowerCase().includes(busqueda)
		})
	}

	if (ordenPrecios == "desc") {
		listaProductosFiltrados.sort((a, b) => b.precio - a.precio)
	} else if (ordenPrecios == "asc") {
		listaProductosFiltrados.sort((a, b) => a.precio - b.precio)
	}

	if (ordenAlfabetico == "desc") {
		listaProductosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre))
	} else if (ordenAlfabetico == "asc") {
		listaProductosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre))
	}

	const inicio = (pagina - 1) * productosPorPagina
	const final = inicio + productosPorPagina
	const productosEnPagina = listaProductosFiltrados.slice(inicio, final)

	if (pagina < 1 || pagina > Math.ceil(listaProductosFiltrados.length / productosPorPagina)) {
		throw new Error(`Número de página inválida. Se esperaba un valor entre 1 y ${Math.ceil(listaProductosFiltrados.length / productosPorPagina)}, se obtuvo ${pagina}.`)
	}

	const contenedorProductos = document.getElementById("row-contenedor-productos")
	contenedorProductos.innerHTML = ""
	const favoritosElement = document.getElementById("favoritos-data")
	let favoritos
	try {
		const favoritosString = localStorage.getItem("favoritos") || favoritosElement.textContent
		favoritos = new Set(JSON.parse(favoritosString))
	} catch (error) {
		favoritos = new Set()
	}

	for (const [i, producto] of productosEnPagina.entries()) {
		const tempContainer = document.createElement("div")
		tempContainer.innerHTML = await crearTarjetaProducto(producto, i)
		contenedorProductos.appendChild(tempContainer.children[0])

		let btnVerFicha = document.getElementById(`verFicha${i}`)
		let btnFavorito = document.getElementById(`favorito${i}`)
	
		if (favoritos.has(producto.id)) {
			btnFavorito.querySelector("i").classList.remove("bi-heart")
			btnFavorito.querySelector("i").classList.add("bi-heart-fill")
		}

		btnVerFicha.addEventListener("click", function() {
			mostrarFichaProducto(productosEnPagina, i)
		})

		btnFavorito.addEventListener("click", function() {
			const productoID = parseInt(btnFavorito.getAttribute("data-id"))
			if (favoritos.has(productoID)) {
				favoritos.delete(productoID)
				this.querySelector("i").classList.add("bi-heart")
				this.querySelector("i").classList.remove("bi-heart-fill")
			} else {
				favoritos.add(productoID)
				this.querySelector("i").classList.add("bi-heart-fill")
				this.querySelector("i").classList.remove("bi-heart")
			}
			localStorage.setItem("favoritos", JSON.stringify(Array.from(favoritos)))
		})
	}
}

//Paginación
function inicializarPaginación() {
	const cantidadPaginas = Object.values(productos).length;
	const paginaMax = Math.ceil(cantidadPaginas / productosPorPagina);
	let paginacion = document.getElementById("paginacion");

	function generarPaginacion() {
		paginacion.innerHTML = "";

		let btnAnterior = document.createElement("li");
		btnAnterior.className = "page-item";
		btnAnterior.innerHTML = '<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>';
		btnAnterior.addEventListener("click", function() {
			if (paginaActual > 1) {
				paginaActual--;
				mostrarProductos(paginaActual, filtroPrecio, filtroAlfabetico);
				actualizarComponente(paginaActual);
			}
		});
		paginacion.appendChild(btnAnterior);

		for (let i = 1; i <= paginaMax; i++) {
			let btnPagina = document.createElement("li");
			btnPagina.className = "page-item";
			btnPagina.innerHTML = `<a class="page-link" href="#">${i}</a>`;
			btnPagina.addEventListener("click", function(event) {
				event.preventDefault();
				let btnActivo = document.querySelector(".pagination .page-item.active");
				let numeroPagina = btnActivo ? btnActivo.querySelector(".page-link").innerText : null;
				paginaActual = parseInt(this.textContent);
				if (numeroPagina !== this.textContent) {
					btnPagina.classList.add("active");
					if (btnActivo) btnActivo.classList.remove("active");
					mostrarProductos(paginaActual, filtroPrecio, filtroAlfabetico);
				}
			});
			paginacion.appendChild(btnPagina);
		}

		let btnSiguiente = document.createElement("li");
		btnSiguiente.className = "page-item";
		btnSiguiente.innerHTML = '<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>';
		btnSiguiente.addEventListener("click", function() {
			if (paginaActual < paginaMax) {
				paginaActual++;
				mostrarProductos(paginaActual, filtroPrecio, filtroAlfabetico);
				actualizarComponente(paginaActual);
			}
		});
		paginacion.appendChild(btnSiguiente);
	}

	function actualizarComponente(pagina) {
		let btnsPagina = paginacion.querySelectorAll(".page-item");
		btnsPagina.forEach(function(button, index) {
			if (index === pagina) {
				button.classList.add("active");
			} else {
				button.classList.remove("active");
			}
		});
	}

	generarPaginacion();
	mostrarProductos(1);
	actualizarComponente(1);
}

inicializarPaginación()

//Listener para el botón del carrito
//window.addEventListener("storage", actualizarBotonCarrito())