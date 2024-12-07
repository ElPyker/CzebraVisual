from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.crypto import get_random_string
import uuid
from requests.models import Company

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        
        if not extra_fields.get('code'):
            extra_fields['code'] = get_random_string(8)
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    user_id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=20, unique=True, null=False, blank=True)
    first_name = models.CharField(max_length=100, null=False)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(max_length=255, unique=True, null=False)
    role = models.CharField(max_length=50, null=True, blank=True)
    company = models.ForeignKey(
        Company, 
        null=True, 
        blank=True, 
        on_delete=models.SET_NULL,
        related_name='employees'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

def save(self, *args, **kwargs):
    # Verifica si el código necesita ser actualizado
    should_update_code = False
    if not self.pk:
        # Usuario nuevo, necesita código
        super().save(*args, **kwargs)  # Guarda para generar user_id
        should_update_code = True
    else:
        # Verifica si ha cambiado la empresa
        original_user = User.objects.filter(pk=self.pk).first()
        if original_user and original_user.company != self.company:
            should_update_code = True

    if should_update_code:
        # Actualiza el código si es necesario
        user_id_str = str(self.user_id).zfill(4)
        company_code = self.company.abbreviation if self.company and self.company.abbreviation else ""
        self.code = f"U-{company_code.upper()}-{user_id_str}" if company_code else f"U-{user_id_str}"

    # Llamar a save() nuevamente si hay cambios en el código
    super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Notification(models.Model):
    notification_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, related_name='notifications', null=True, on_delete=models.SET_NULL)
    message = models.TextField(null=False)
    notification_date = models.DateTimeField(auto_now_add=True)
    performed_by = models.ForeignKey(User, related_name='performed_notifications', null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"Notification for {self.user.first_name} {self.user.last_name}"

class Division(models.Model):
    division_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)
    manager_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_divisions')

    class Meta:
        db_table = 'use_Division'

    def __str__(self):
        return self.name

class DivisionUser(models.Model):
    division_user_id = models.AutoField(primary_key=True)
    division = models.ForeignKey(Division, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    assigned_date = models.DateField(auto_now_add=True)
    removed_date = models.DateField(null=True, blank=True)

    class Meta:
        db_table = 'use_DivisionUser'
        unique_together = (('division', 'user'),)

    def __str__(self):
        return f"{self.division.name} - {self.user.email}"
