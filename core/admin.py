from django.contrib import admin
from .models import Cuenta, Producto, Boleta, ProductoEnBoleta , Tarjeta , Arriendo, Doctor, Availability

# Register your models here.

admin.site.register(Cuenta)
admin.site.register(Producto)
admin.site.register(Boleta)
admin.site.register(ProductoEnBoleta)
admin.site.register(Tarjeta)
admin.site.register(Arriendo)
admin.site.register(Doctor)
admin.site.register(Availability)