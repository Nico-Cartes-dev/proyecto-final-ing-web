# Generated by Django 5.0.7 on 2024-07-16 23:56

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Arriendo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_arriendo', models.DateField()),
                ('fecha_fin', models.DateField()),
                ('nombre', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Boleta',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('rut', models.CharField(blank=True, max_length=12, null=True)),
                ('fecha', models.DateTimeField(default=django.utils.timezone.now)),
                ('total', models.DecimalField(decimal_places=0, max_digits=12)),
                ('estado_pedido', models.CharField(choices=[('Anulado', 'Anulado'), ('En proceso', 'En proceso'), ('Despachado', 'Despachado'), ('Entregado', 'Entregado'), ('Vendido', 'Vendido')], default='En proceso', max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
                ('precio', models.FloatField()),
                ('stock', models.IntegerField(default=0)),
                ('descripcion', models.TextField()),
                ('categoria', models.CharField(choices=[('Ruta', 'Ruta'), ('Urbana', 'Urbana'), ('Montaña', 'Montaña'), ('Infantil', 'Infantil')], max_length=100, null=True)),
                ('en_descuento', models.BooleanField(default=False)),
                ('en_restock', models.BooleanField(default=False)),
                ('descuento', models.FloatField(default=0.0)),
                ('precio_arriendo', models.FloatField()),
                ('imagen', models.ImageField(blank=True, null=True, upload_to='img/')),
            ],
        ),
        migrations.CreateModel(
            name='Tarjeta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('card_number', models.CharField(default=0, max_length=19)),
                ('card_name', models.CharField(default=0, max_length=50)),
                ('exp_month', models.IntegerField(default=1)),
                ('exp_year', models.IntegerField(default=2024)),
                ('ccv', models.CharField(default=0, max_length=3)),
            ],
        ),
        migrations.CreateModel(
            name='Cuenta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rut', models.CharField(max_length=12, unique=True)),
                ('nombres', models.CharField(max_length=100)),
                ('apellidos', models.CharField(max_length=100)),
                ('correo', models.EmailField(max_length=254, unique=True)),
                ('direccion', models.TextField(max_length=100)),
                ('contraseña', models.CharField(max_length=100)),
                ('subscrito', models.BooleanField(default=False)),
                ('imagen', models.ImageField(blank=True, null=True, upload_to='perfil/')),
                ('rol', models.CharField(choices=[('Cliente', 'Cliente'), ('Administrador', 'Administrador')], default='Cliente', max_length=20)),
                ('favoritos', models.ManyToManyField(blank=True, related_name='favorited_by', to='core.producto')),
            ],
        ),
        migrations.CreateModel(
            name='ProductoEnBoleta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.IntegerField(default=1)),
                ('boleta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.boleta')),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.producto')),
            ],
        ),
        migrations.AddField(
            model_name='boleta',
            name='productos',
            field=models.ManyToManyField(through='core.ProductoEnBoleta', to='core.producto'),
        ),
    ]
