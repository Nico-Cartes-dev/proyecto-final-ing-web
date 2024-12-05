# Generated by Django 5.1.3 on 2024-12-05 01:13

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_availability_hora_availability_libre_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='availability',
            name='hora',
        ),
        migrations.RemoveField(
            model_name='availability',
            name='libre',
        ),
        migrations.AlterField(
            model_name='arriendo',
            name='hora',
            field=models.TimeField(default=django.utils.timezone.now),
        ),
    ]
