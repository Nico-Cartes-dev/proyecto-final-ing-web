$(document).ready(function() {
	$.validator.addMethod("rutChileno", function(value, element) {
		var rutPattern = /^\d{7,8}-[\dK]$/
		return rutPattern.test(value)
	}, "El RUT no es válido (escriba sin puntos y con guión)")

	$.validator.addMethod("emailCompleto", function(value, element) {
		var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z\-0-9]{2,}))$/
		return regex.test(value);
	}, 'El formato del correo no es válido')
	
	$.validator.addMethod("soloLetras", function(value, element) {
		return this.optional(element) || /^[a-zA-Z\s]*$/.test(value)
	}, "Sólo se permiten letras y espacios en blanco.")

	document.getElementById('campo_rut').addEventListener('keyup', function(e) {
		e.target.value = e.target.value.toUpperCase()
	})
	$("#formulario_misdatos").validate({
		rules: {
			campo_rut: {
				required: true,
				rutChileno: true
			},
			campo_nombres: {
				required: true,
				soloLetras: true
			},
			campo_apellidos: {
				required: true,
				soloLetras: true
			},
			campo_correo: {
				required: true,
				emailCompleto: true,
			},
			campo_direccion: {
				required: true,
				minlength: 15,
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
				required: "El RUT es un campo requerido",
				rutChileno: "El RUT no es válido (escriba sin puntos y con guión)"
			},
			campo_nombres: {
				required: "El nombre es un campo requerido",
				soloLetras: "El nombre sólo puede contener letras y espacios en blanco",
			},
			campo_apellidos: {
				required: "Apellidos es un campo requerido",
				soloLetras: "Apellidos solo puede contener letras y espacion en blanco"
			},
			campo_correo: {
				required: "El correo es un campo requerido",
				emailCompleto: "El formato del correo no es válido",
			},
			campo_direccion: {
				required: "El campo direccion es obligatorio",
				minlength: "El minimo de caracteres para la direccion es de 15",
				maxlength: "El maximo de caracteres para la direccion es de 100",
			},
			campo_contraseña: {
				required: "La contraseña es un campo requerido",
				minlength: "La contraseña debe tener un mínimo de 5 caracteres",
				maxlength: "La contraseña debe tener un máximo de 15 caracteres",
			},
			campo_repetir_contraseña: {
				required: "Repetir contraseña es un campo requerido",
				minlength: "Repetir contraseña debe tener un mínimo de 5 caracteres",
				maxlength: "Repetir contraseña debe tener un máximo de 15 caracteres",
				equalTo: "Debe repetir la contraseña escrita anteriormente",
			}
		},
		errorPlacement: function(error, element) {
			error.addClass('invalid-feedback')
			if (element.closest('.input-group').length) {
			error.insertAfter(element.parent())
			} else {
			error.insertAfter(element)
			}
		},
		highlight: function(element) {
			$(element).addClass('is-invalid')
			$(element).removeClass("is-valid")
		},
		unhighlight: function(element) {
			$(element).addClass("is-valid")
			$(element).removeClass('is-invalid')
		}
	});
});
