# Generated by Django 5.1.3 on 2024-12-03 17:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_arriendo_doctor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='producto',
            name='categoria',
            field=models.CharField(choices=[('Medicina General', 'Medicina General'), ('Pediatría', 'Pediatría'), ('Odontologia', 'Odontologia')], max_length=100, null=True),
        ),
    ]
