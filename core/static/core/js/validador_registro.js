$(document).ready(function() {
	$.validator.addMethod("rutChileno", function(value, element) {
		var rutPattern = /^\d{7,8}-[\dK]$/;
		return rutPattern.test(value)
	}, "El RUT no es válido (escriba sin puntos y con guión)");

	$.validator.addMethod("emailCompleto", function(value, element) {
		var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z\-0-9]{2,}))$/;
		return regex.test(value);
	}, 'El formato del correo no es válido');
	
	$.validator.addMethod("soloLetras", function(value, element) {
		return this.optional(element) || /^[a-zA-Z\s]*$/.test(value);
	}, "Sólo se permiten letras y espacios en blanco.");

	document.getElementById("campo_rut").addEventListener('keyup', function(e) {
		e.target.value = e.target.value.toUpperCase();
	});

	$("#formulario_registro").validate({
		rules: {
			campo_rut: {
				required: true,
				rutChileno: true
			},
			campo_nombres: {
				required: true,
				soloLetras: true
			},
			campo_apellidos:{
				required: true,
				soloLetras: true
			},
			campo_correo: {
				email: true,
				required: true,
				emailCompleto: true,
			},
			campo_direccion: {
				required: true,
				// minlength: 15,
				maxlength: 100,
			},
			campo_contraseña: {
				required: true,
				minlength: 5,
				maxlength: 20,
			},
			campo_repetir_contraseña: {
				required: true,
				minlength: 5,
				maxlength: 20,
				equalTo: "#campo_contraseña",
			}
		},
		messages: {
			campo_rut: {
				required: "Este campo es obligatorio.",
				rutChileno: "RUT no válido (escriba sin puntos y con guión)."
			},
			campo_nombres: {
				required: "Este campo es obligatorio.",
				soloLetras: "Sólo se permiten letras y espacios.",
			},
			campo_apellidos: {
				required: "Este campo es obligatorio.",
				soloLetras: "Sólo se permiten letras y espacios."
			},
			campo_correo: {
				required: "Este campo es obligatorio.",
				email: "El correo no es válido.",
			},
			campo_direccion: {
				required: "Este campo es obligatorio.",
				// minlength: "El mínimo de caracteres es de 15.",
				maxlength: "El maximo de caracteres es de 100.",
			},
			campo_contraseña: {
				required: "Este campo es obligatorio.",
				minlength: "El mínimo de caracteres es de 5.",
				maxlength: "El máximo de caracteres es de 15.",
			},
			campo_repetir_contraseña: {
				required: "Este campo es obligatorio.",
				minlength: "El mínimo de caracteres es de 5.",
				maxlength: "El máximo de caracteres es de 15.",
				equalTo: "Las contraseñas no coinciden.",
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
