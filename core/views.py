import json
from .utils import CATEGORIAS_JUEGOS,MESES,AÑOS
from core.models import Boleta, Cuenta, Producto, ProductoEnBoleta , Tarjeta , Arriendo
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib import messages
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth.hashers import check_password, make_password
from .decoradores import check_rol_admin


# Create your views here.

def index(request): return render(request, "core/index.html")
def navegacion(request): return render(request, "core/navegacion.html")
def footer(request): return render(request, "core/footer.html")
def nosotros(request): return render(request, "core/nosotros.html")
def error404(request): return render(request, "core/error404.html")
def tarjeta(request): return render(request, "core/tarjeta.html", {"meses": MESES, "años": AÑOS})
def formulario_arriendo(request): return render(request, "core/formulario_arriendo.html")
def guardar_datos(request): return render(request, "core/guardar_datos.html")
def transferencia(request): return render(request, "core/transferencia.html")







@check_rol_admin
def panel_admin(request): return render(request, "core/panel_admin.html")

@check_rol_admin
def agregar_productos(request): return render(request, "core/agregar_productos.html")

@check_rol_admin
def agregar_user(request):
	if request.method == "POST":
		rut = request.POST["campo_rut"]
		nombres = request.POST["campo_nombres"]
		apellidos = request.POST["campo_apellidos"]
		correo = request.POST["campo_correo"]
		direccion = request.POST["campo_direccion"]
		foto_registro = request.FILES.get("campo_foto")
		subscrito = request.POST.get("es_subscriptor", False)
		if subscrito:
			subscrito = True
		contraseña = request.POST["campo_contraseña"]
		if Cuenta.objects.filter(rut=rut).exists():
			messages.error(request, "Ya existe un rut como este.")
			return redirect("agregar_user")
		elif Cuenta.objects.filter(correo=correo).exists():
			messages.error(request, "Ya existe un correo como este.")
			return redirect("agregar_user")
		usuario = Cuenta(rut=rut,nombres=nombres,apellidos=apellidos,correo=correo,direccion=direccion,contraseña=make_password(contraseña),subscrito=subscrito,imagen=foto_registro)
		usuario.save()
		messages.success(request, f"Cuenta creada con éxito: {nombres} {apellidos} ({correo})")
		
		return redirect("agregar_user")
	
	cuentas = Cuenta.objects.all()  # O usa getUsers() si tienes una función específica
	return render(request, "core/agregar_user.html", {"cuentas": cuentas})

@check_rol_admin
def actualizar_cuenta_admin(request):
	if request.method != "POST":
		messages.error(request, "Método no permitido.")
		return redirect("index")
	cuenta_rut = request.POST["campo_rut"]
	if not cuenta_rut:
		messages.error(request, "No hay una sesión iniciada.")
		return redirect("login")
	try:
		cuenta = Cuenta.objects.get(rut=cuenta_rut)
		cuenta.nombres = request.POST["campo_nombres"]
		cuenta.apellidos = request.POST["campo_apellidos"]
		cuenta.direccion = request.POST["campo_direccion"]
		cuenta.subscrito = request.POST.get("es_subscriptor", False)
		cuenta.imagen = request.FILES.get("campo_foto", cuenta.imagen)
		if cuenta.subscrito:
			cuenta.subscrito = True
		cuenta.save()
		messages.success(request, "Datos actualizados correctamente.")
		return redirect("agregar_user")
	except Cuenta.DoesNotExist:
		messages.error(request, "Cuenta no encontrada.")
		return redirect("login")

def api(request): return render(request, "core/api.html")
#def boleta(request): return render(request, "core/boleta.html")
def carrito_compras(request): return render(request, "core/carrito_compras.html")

@check_rol_admin
def mantenedor_bodega(request): 
	productos = Producto.objects.all()
	return render(request, "core/mantenedor_bodega.html", {"categorias": CATEGORIAS_JUEGOS, "productos": productos})

def mis_datos(request): return render(request, "core/mis_datos.html")
def nosotros(request): return render(request, "core/nosotros.html")

#=============================
#          CUENTA
#=============================
def login(request):
	if request.method == "POST":
		correo = request.POST.get("campo_correo")
		contraseña = request.POST.get("campo_contraseña")
		try:
			cuenta = Cuenta.objects.get(correo = correo)
			if check_password(contraseña, cuenta.contraseña):
				request.session["cuenta_rut"] = cuenta.rut
				request.session["cuenta_nombres"] = cuenta.nombres
				request.session["cuenta_apellidos"] = cuenta.apellidos
				request.session["cuenta_correo"] = cuenta.correo
				request.session["cuenta_direccion"] = cuenta.direccion
				request.session["cuenta_es_subscriptor"] = cuenta.subscrito
				request.session["foto_perfil"] = cuenta.imagen.url if cuenta.imagen else "/static/core/img/user_sample.jpg"
				request.session["cuenta_rol"] = cuenta.rol
				request.session["cuenta_favoritos"] = list(cuenta.favoritos.values_list("id", flat=True))
				request.session["logeado"] = True
				messages.success(request, f"Sesión iniciada como {cuenta.nombres} {cuenta.apellidos} ({cuenta.correo}).")
				return redirect("index")
			messages.error(request, "Contraseña incorrecta.")
		except:
			messages.error(request, "Este correo no existe.")
	return render(request, "core/login.html")

def registro(request):
	if request.method == "POST":
		rut = request.POST["campo_rut"]
		nombres = request.POST["campo_nombres"]
		apellidos = request.POST["campo_apellidos"]
		correo = request.POST["campo_correo"]
		dirección = request.POST["campo_direccion"]
		subscrito = request.POST.get("es_subscriptor", False)
		foto_registro = request.FILES.get("campo_foto")
		if not foto_registro:
			foto_registro = "user_sample.jpg"
		if subscrito:
			subscrito = True
		contraseña = request.POST["campo_contraseña"]
		confirmar_contraseña = request.POST["campo_repetir_contraseña"]
		if contraseña == confirmar_contraseña:
			if Cuenta.objects.filter(correo = correo).exists():
				messages.error(request, "Ya existe un correo como este.")
				return redirect("registro")
			elif Cuenta.objects.filter(rut = rut).exists():
				messages.error(request, "Ya existe un RUT como este.")
				return redirect("registro")								
			usuario = Cuenta(rut = rut, nombres = nombres, apellidos = apellidos, correo = correo, direccion = dirección, contraseña = make_password(contraseña), subscrito = subscrito, imagen = foto_registro)
			usuario.save()
			return redirect("login")
		else:
			messages.error(request, "Las contraseñas no coinciden.")
			return redirect("registro")
	return render(request, "core/registro.html")

def actualizar_cuenta(request):
	if request.method != "POST":
		messages.error(request, "Método no permitido.")
		return redirect("index")
	cuenta_rut = request.session["cuenta_rut"]
	if not cuenta_rut:
		messages.error(request, "No hay una sesión iniciada.")
		return redirect("login")
	try:
		cuenta = Cuenta.objects.get(rut=cuenta_rut)
		contraseña = request.POST["campo_contraseña"]
		# repetir_contraseña = request.POST["campo_repetir_contraseña"]
		# if contraseña != repetir_contraseña:
		# 	messages.error(request, "Las contraseñas no coinciden.")
		# 	return redirect("mis_datos")
		if not check_password(contraseña, cuenta.contraseña):
			messages.error(request, "Contraseña incorrecta.")
			return redirect("mis_datos")
		cuenta.nombres = request.POST["campo_nombres"]
		cuenta.apellidos = request.POST["campo_apellidos"]
		cuenta.direccion = request.POST["campo_direccion"]
		cuenta.subscrito = request.POST.get("es_subscriptor", False)
		cuenta.imagen = request.FILES.get("campo_foto")
		if cuenta.subscrito:
			cuenta.subscrito = True
		#==================================================================
		# ALÉJATE DEMONIO
		imagen_cuenta = cuenta.imagen.url.replace("/media/", "/media/perfil/") if cuenta.imagen else "/static/core/img/user_sample.jpg"
		#==================================================================
		request.session["cuenta_nombres"] = cuenta.nombres
		request.session["cuenta_apellidos"] = cuenta.apellidos
		request.session["cuenta_correo"] = cuenta.correo
		request.session["cuenta_direccion"] = cuenta.direccion
		request.session["cuenta_es_subscriptor"] = cuenta.subscrito
		request.session["foto_perfil"] = imagen_cuenta
		cuenta.save()
		messages.success(request, "Datos actualizados correctamente.")
		return redirect("mis_datos")
	except Cuenta.DoesNotExist:
		messages.error(request, "Cuenta no encontrada.")
		return redirect("login")

def logout(request):
	request.session.flush()
	return redirect("index")

def getUsers():
	cuentas = Cuenta.objects.all()
	return cuentas

@check_rol_admin
def eliminar_cuenta(request, cuentaID):
	try:
		cuenta = Cuenta.objects.get(rut=cuentaID)
		boletas = Boleta.objects.filter(rut=cuentaID)
		if boletas.exists():
			messages.error(request, "No se puede eliminar a este usuario, ya que tiene boletas asociadas.")
			return JsonResponse({"error": "No se puede eliminar a este usuario, ya que tiene boletas asociadas."}, status=400)
		cuenta.delete()
		messages.success(request, "Usuario eliminado con éxito.")
		return JsonResponse({"success": "Usuario eliminado con éxito."})
	except Cuenta.DoesNotExist:
		messages.error(request, "Cuenta no encontrada.")
		return JsonResponse({"error": "Cuenta no encontrada."}, status=404)

#=============================
#          PRODUCTOS
#=============================
@check_rol_admin
def agregar_productos(request, id=None):
	if request.method == "POST":
		nombre = request.POST.get("campo_nombre")
		precio = request.POST.get("campo_precio")
		descripcion = request.POST.get("campo_descripcion")
		categoria = request.POST.get("campo_categoria")
		descuento = request.POST.get("campo_descuento_oferta")
		precio_arriendo = request.POST.get("campo_descuento_sub")
		imagen = request.FILES.get("campo_foto")

		if not all([nombre, precio, descripcion, imagen]):
			messages.error(request, "Todos los campos son requeridos.")
		else:
			if id:
				producto = get_object_or_404(Producto, id=id)
				producto.nombre = nombre
				producto.descripcion = descripcion
				producto.precio = precio
				producto.categoria = categoria
				producto.descuento = descuento
				producto.precio_arriendo = precio_arriendo
				if imagen:
					producto.imagen = imagen
				producto.save()
			else:
				producto = Producto(nombre=nombre, precio=precio, stock=0, descripcion=descripcion, imagen=imagen, categoria=categoria, descuento=descuento, precio_arriendo=precio_arriendo)
				producto.save()
			return redirect("agregar_productos")
	productos = Producto.objects.all()
	return render(request, "core/agregar_productos.html", {"productos": productos, "producto_id": id, "categorias": CATEGORIAS_JUEGOS})

@check_rol_admin
def eliminar_producto(request, id):
	if request.method == "POST":
		producto = get_object_or_404(Producto, id=id)
		producto.delete()
		return redirect("agregar_productos")
	return JsonResponse({"Error": "Método no permitido."}, status=405)

@check_rol_admin
def actualizar_producto(request):
	if request.method != "POST":
		messages.error(request, "Método no permitido.")
	producto_id = json.loads(request.POST["campo_nombre"]).get("id")
	try:
		producto = Producto.objects.get(id=producto_id)
		if not producto:
			messages.error(request, f"No se encontró un producto con esta ID: {producto_id}")
			return redirect("mantenedor_bodega")
		stockASumar = request.POST["campo_cantidad"]
		producto.stock += int(stockASumar)
		
		producto.save()
		messages.success(request, "Datos actualizados correctamente.")
		return redirect("mantenedor_bodega")
	except Producto.DoesNotExist:
		messages.error(request, "Producto no encontrado.")
		return redirect("mantenedor_bodega")

@check_rol_admin
def importar_productos(request):
	if request.method == "POST":
		try:
			data = json.loads(request.body)
			for producto in data:
				Producto.objects.create(
					nombre=producto.get("nombre"),
					precio=producto.get("precio"),
					stock=producto.get("stock", 0),
					descripcion=producto.get("descripcion"),
					categoria=producto.get("categoria"),
					en_descuento=producto.get("en_descuento", False),
					en_restock=producto.get("en_restock", False),
					descuento=producto.get("descuento", 0),  # Use `descuento` if that is the correct field name
					precio_arriendo=producto.get("precio_arriendo"),
					imagen=producto.get("img", None)  # Use `img` key for the image
				)
			return JsonResponse({"mensaje": "Productos importados correctamente."})
		except Exception as e:
			return JsonResponse({"Error": str(e)}, status=400)
	return JsonResponse({"Error": "Método no permitido."}, status=405)

def obtener_productos(request):
	producto_id = request.GET.get("id")
	categoria = request.GET.get("categoria")
	def get_img(img):
		img = img.url if img else "/static/core/img/user_sample.jpg"
		return img.replace("/media/", "")
	if producto_id:
		try:
			producto = Producto.objects.get(id=producto_id)
			producto_data = {
				"id": producto.id,
				"nombre": producto.nombre,
				"precio": producto.precio,
				"stock": producto.stock,
				"descripcion": producto.descripcion,
				"imagen": get_img(producto.imagen),
				"categoria": producto.categoria,
				"en_descuento": producto.en_descuento,
				"en_restock": producto.en_restock,
				"descuento": producto.descuento,
				"precio_arriendo": producto.precio_arriendo,
			}
			return JsonResponse([producto_data], safe=False)
		except Producto.DoesNotExist:
			return JsonResponse({"error": "Producto no encontrado."}, status=404)
	elif categoria:
		productos = Producto.objects.filter(categoria=categoria).values("id", "nombre", "imagen", "stock")
		return JsonResponse({"productos": list(productos)})
	else:
		productos = Producto.objects.all().values()
		productos_lista = list(productos)
		return JsonResponse(productos_lista, safe=False)

#=============================
#          BOLETAS
#=============================
def crear_boleta(request):
	if request.method == "POST":
		try:
			data = json.loads(request.body)
			productos = data.get("producto", [])
			total = 0
			for producto in productos:
				producto["descripcion"] = producto["descripcion"]
				producto_obj = Producto.objects.get(id=producto["id"])
				total += producto_obj.precio * producto["cantidad"]
			boleta = Boleta.objects.create(rut=request.session.get("cuenta_rut"), total=total)
			for producto in productos:
				producto_obj = Producto.objects.get(id=producto["id"])
				cantidad = producto["cantidad"]
				ProductoEnBoleta.objects.create(boleta=boleta, producto=producto_obj, cantidad=cantidad)
			boleta.save()
			return JsonResponse({"mensaje": "Boleta creada correctamente."})
		except Exception as e:
			return JsonResponse({"error": str(e)}, status=400)
	return JsonResponse({"error": "Método no permitido"}, status=405)

def verificar_boletas(request):
	if request.method == "GET":
		cuenta_rut = request.session.get("cuenta_rut")
		if cuenta_rut:
			boletas = Boleta.objects.filter(rut=cuenta_rut).exists()
			return JsonResponse({"boletas": boletas})
		return JsonResponse({"boletas": False})
	return JsonResponse({"error": "Método no permitido."}, status="405")

def obtener_boletas_user(request):
	cuenta_rut = request.session.get("cuenta_rut")
	if request.method != "GET":
		return JsonResponse({"error": "Método no permitido"}, status=405)
	elif not cuenta_rut:
		return JsonResponse({"boletas": []})
	boletas = Boleta.objects.filter(rut=cuenta_rut).values("id", "fecha", "total", "estado_pedido")
	boletas_con_productos = []
	for boleta in boletas:
		productos_en_boleta = ProductoEnBoleta.objects.filter(boleta_id=boleta["id"]).select_related("producto")
		productos = [
			{
				"imagen": producto.producto.imagen.url if producto.producto.imagen else "/static/core/img/user_sample.jpg",
				"nombre": producto.producto.nombre,
				"cantidad": producto.cantidad,
				"precio": float(producto.producto.precio)
			}
			for producto in productos_en_boleta
		]
		boleta["productos"] = productos
		boletas_con_productos.append(boleta)
	return JsonResponse({"boletas": boletas_con_productos})

#No maneja usuarios anónimos.
def obtener_boletas():
	boletas = Boleta.objects.all().values("id", "fecha", "rut", "total", "estado_pedido")
	boletas_con_productos = []
	for boleta in boletas:
		cliente = Cuenta.objects.get(rut=boleta["rut"])
		productos_en_boleta = ProductoEnBoleta.objects.filter(boleta_id=boleta["id"]).select_related("producto")
		productos = [
			{
				"imagen": producto.producto.imagen.url if producto.producto.imagen else "/static/core/img/user_sample.jpg",
				"nombre": producto.producto.nombre,
				"cantidad": producto.cantidad,
				"precio": float(producto.producto.precio)
			}
			for producto in productos_en_boleta
		]
		boleta["productos"] = productos
		boleta["fecha"] = boleta["fecha"].strftime("%Y-%m-%d")
		boleta["total"] = float(boleta["total"])
		boleta["cliente"] = {
			"nombres": cliente.nombres,
			"apellidos": cliente.apellidos,
			"subscrito": cliente.subscrito
		}
		boletas_con_productos.append(boleta)
	return boletas_con_productos

#Redirige a la página de historial de compras del usuario con las boletas que ha generado.
def historial_compras(request):
	boletas = Boleta.objects.filter(rut=request.session.get("cuenta_rut"))
	return render(request, "core/historial_compras.html", {"boletas": boletas})

@check_rol_admin
def ventas(request): 
	boletas = obtener_boletas()
	return render(request, "core/ventas.html", {"boletas": boletas}) 

#Cambiar estado de los pedidos.
@check_rol_admin
def actualizar_estado_boleta(request, boletaID, nuevo_estado):
	try:
		boleta = Boleta.objects.get(id=boletaID)
		boleta.estado_pedido = nuevo_estado
		boleta.save()
		respuesta = {
			"message": f"Estado de la boleta #{boletaID} actualizado correctamente.",
			"boletaID": boletaID,
			"nuevo_estado": nuevo_estado
		}
		#messages.success(request, f"Estado de la boleta #{boletaID} actualizado correctamente.")
		return render(request, "core/ventas.html") and JsonResponse(respuesta)
	except Boleta.DoesNotExist:
		return JsonResponse({"error": "Boleta no encontrada."}, status=404)
	except Exception as e:
		return JsonResponse({"error": str(e)}, status=500)

@csrf_protect
def guardar_tarjeta(request):
	if request.method:
		cardNumber = request.POST.get('cardNumber')
		cardName = request.POST.get('cardName')
		expMonth = request.POST.get('expMonth')
		expYear = request.POST.get('expYear')
		ccv = request.POST.get('ccv')
		if not all([cardNumber,cardName,expMonth,expYear,ccv]):
			messages.error(request, "Todos los campos son requeridos.")
			return redirect("tarjeta")
		if not request.POST.get('rut'):
			messages.error(request, "No hay una sesión iniciada.")
			return redirect("login")
		tarjeta= Tarjeta(card_number=cardNumber,card_name=cardName,exp_month=expMonth,exp_year=expYear,ccv=ccv)
		tarjeta.save()
		messages.success(request, "Tarjeta guardada")
		return redirect("transferencia")
	return render(request, "core/tarjeta.html")

def guardar_datos(request):
	if request.method:
		fecha_inicio= request.POST.get('fechain')
		fecha_fin= request.POST.get('fechafin')
		nombres= request.POST.get('inmu')
		print(request.POST)
		print(fecha_inicio,fecha_fin,nombres)
		if not all([fecha_inicio,fecha_fin,nombres]):
			messages.error(request, "Todos los campos son requeridos.")
			return redirect("formulario_arriendo")
		farriendo= Arriendo(fecha_arriendo=fecha_inicio, fecha_fin=fecha_fin,nombre=nombres)
		farriendo.save()
		messages.success(request, "Datos guardados")
		return redirect("tarjeta")
	return render(request, "core/formulario_arriendo.html")


	