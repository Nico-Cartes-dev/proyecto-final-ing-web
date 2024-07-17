$(document).ready(function() {
	$.validator.addMethod("soloNumeros", function(value, element) {
		return this.optional(element) || /^[\d]*$/.test(value);
	}, "Sólo se permiten letras y espacios en blanco.");

	$("#formulario_bodega").validate({
		rules: {
			campo_categoria: {
				required: true
			},
			campo_nombre: {
				required: true
			},
			campo_cantidad: {
				required: true,
				number: true,
				
			}
		},
		messages: {
			campo_categoria: {
				required: "Selecciona una categoría."
			},
			campo_nombre: {
				required: "Selecciona un juego."
			},
			campo_cantidad: {
				required: "Ingresa una cantidad.",
				number: "Ingresa un número válido.",
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
