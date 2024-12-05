from django.utils import timezone
from django.db import models
from .utils import DIAS

# Create your models here.
class Producto(models.Model):
	CATEGORIAS = [
		("Medicina General", "Medicina General"),
		("Pediatría", "Pediatría"),
		("Odontologia", "Odontologia")
	]

	id = models.AutoField(primary_key=True)
	nombre = models.CharField(max_length=255)
	precio = models.FloatField()
	stock = models.IntegerField(default=0)
	descripcion = models.TextField()
	categoria = models.CharField(max_length=100, choices=CATEGORIAS, null=True)
	en_descuento = models.BooleanField(default=False)
	en_restock = models.BooleanField(default=False)
	descuento = models.FloatField(default=0.0)
	precio_arriendo = models.FloatField()
	imagen = models.ImageField(null=True, blank=True, upload_to="img/")

	def __str__(self):
		return f"#{self.id} | {self.nombre}"

class Boleta(models.Model):
	ESTADO_PEDIDOS = [
		("Anulado", "Anulado"),
		("En proceso", "En proceso"),
		("Despachado", "Despachado"),
		("Entregado", "Entregado"),
		("Vendido", "Vendido")
	]

	id = models.AutoField(primary_key=True)
	rut = models.CharField(max_length=12, blank=True, null=True)
	productos = models.ManyToManyField(Producto, through="ProductoEnBoleta")
	fecha = models.DateTimeField(default=timezone.now)
	total = models.DecimalField(max_digits=12, decimal_places=0)
	estado_pedido = models.CharField(max_length=20, choices=ESTADO_PEDIDOS, default="En proceso")

	def __str__(self):
		return f"Boleta #{self.id} - {self.fecha}"
	
class Cuenta(models.Model):
	ROLES = [
		("Cliente", "Cliente"), 
		("Administrador", "Administrador")
	]

	rut = models.CharField(max_length=12, unique=True)
	nombres = models.CharField(max_length=100)
	apellidos = models.CharField(max_length=100)
	correo = models.EmailField(unique=True)
	direccion = models.TextField(max_length=100)
	contraseña = models.CharField(max_length=100)
	subscrito = models.BooleanField(default=False)
	imagen = models.ImageField(null=True, blank=True, upload_to="perfil/")
	rol = models.CharField(max_length=20, choices=ROLES, default="Cliente")
	favoritos = models.ManyToManyField(Producto, related_name="favorited_by", blank=True)

	def __str__(self):
		return f"{self.correo}"
	
class ProductoEnBoleta(models.Model):
	boleta = models.ForeignKey(Boleta, on_delete=models.CASCADE)
	producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
	cantidad = models.IntegerField(default=1)

	def __str__(self):
		return f"{self.producto.nombre} - Cantidad: {self.cantidad}"

class Tarjeta(models.Model):
	card_number = models.CharField(max_length=19, default=0)
	card_name = models.CharField(max_length=50 ,default=0)
	exp_month = models.IntegerField(default=1)
	exp_year = models.IntegerField(default=2024)
	ccv = models.CharField(max_length=3 ,default=0)
	

	def __str__(self):
		return self.card_number
	
class Arriendo(models.Model):
	fecha_arriendo = models.DateField()
	# fecha_fin = models.DateField()
	nombre = models.CharField(max_length=50)
	doctor = models.ForeignKey('Doctor', on_delete=models.SET_NULL, null=True, blank=True)
	hora = models.TimeField(default=timezone.now)
	rut=models.CharField(max_length=12, null=True, blank=True)

	def __str__(self):
		return f"{self.nombre} - {self.doctor.name if self.doctor else 'Sin médico'}"

class Doctor(models.Model):
	name = models.CharField(max_length=100)

	def __str__(self):
		return self.name

class Availability(models.Model):
	doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='availabilities')
	date = models.DateField()
	# libre = models.JSONField(default=DIAS)
	available_slots = models.JSONField(default=dict)


	def __str__(self):
		return f"{self.doctor.name} - {self.date}"