$(document).ready(function() {
	$.validator.addMethod("soloLetras", function(value, element) {
		return this.optional(element) || /^[a-zA-Z\s]*$/.test(value);
	}, "Sólo se permiten letras y espacios en blanco.");

	$.validator.addMethod("soloNumeros", function(value, element) {
		return this.optional(element) || /^[\d]*$/.test(value);
	}, "Sólo se permiten letras y espacios en blanco.");    

	$("#formulario_agregar_productos").validate({
		rules: {
			campo_id: {
				required: true,
				soloNumeros: true
			},
			campo_nombre: {
				required: true
			},
			campo_precio: {
				required: true,
				number:true,
				min:0
			},
			campo_descripcion: {
				required: true,
				soloLetras: true
			},
			campo_categoria: {
				required: true,
			},          
			campo_descuento_sub: {
				required: true,
				number:true,
				min:0,
				max:100
			},
			campo_descuento_oferta: {
				required: true,
				number:true,
				min:0,
				max:100
			},
			campo_categoria: {
				required: true,
			}
		},
		messages: {
			campo_id: {
				required: "El id del producto debe contener solo números",
				soloNumeros: "El id del producto debe ser numérico."
			},
			campo_nombre: {
				required: "El nombre del producto es un campo requerido",
			},
			campo_precio: {
				required: "El precio del producto sólo números",
				soloNumeros: "El precio del producto debe ser numérico."
			},
			campo_descripcion: {
				required: "La descripción del producto es un campo requerido",
				soloLetras: "La descripción del producto debe ser alfanumérico."
			},
			campo_categoria: {
				required: "Se requiere la categoría del producto.",
			},
			campo_descuento_sub: {
				required: "El descuento por suscriptor debe ser solo números",
				soloNumeros: "Sólo se permiten números enteros y positivos."
			},
			campo_descuento_oferta: {
				required: "El descuento por oferta debe ser solo números",
				soloNumeros: "Sólo se permiten números enteros y positivos."
			}
		},
		errorPlacement: function(error, element) {
			error.addClass('invalid-feedback');
			if (element.closest('.input-group').length) {
				error.insertAfter(element.parent());
			} else {
				error.insertAfter(element);
			}
		},
		highlight: function(element) {
			$(element).addClass('is-invalid');
			$(element).removeClass("is-valid")
		},
		unhighlight: function(element) {
			$(element).addClass("is-valid")
			$(element).removeClass('is-invalid');
		}
	});
});
