# Generated by Django 5.1 on 2024-10-10 19:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('requests', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company',
            name='code',
            field=models.CharField(blank=True, max_length=20, unique=True),
        ),
    ]
