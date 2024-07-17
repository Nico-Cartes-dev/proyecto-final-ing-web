from django.shortcuts import redirect
from django.contrib import messages

def check_rol_admin(view_func):
	def _wrapped_view_func(request, *args, **kwargs):
		if request.session.get("cuenta_rol") != "Administrador":
			messages.error(request, "No tienes permisos suficientes.")
			return redirect("error404")
		return view_func(request, *args, **kwargs)
	return _wrapped_view_func

