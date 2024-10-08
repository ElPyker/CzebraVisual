# Generated by Django 5.1 on 2024-10-10 19:39

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('requests', '0002_alter_company_code'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='company',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='employees', to='requests.company'),
        ),
        migrations.AlterField(
            model_name='user',
            name='code',
            field=models.CharField(blank=True, max_length=20, unique=True),
        ),
    ]
