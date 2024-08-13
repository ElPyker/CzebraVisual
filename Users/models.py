from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # Se usa set_password para almacenar el hash de la contraseña
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
    code = models.CharField(max_length=20, unique=True, null=False)
    first_name = models.CharField(max_length=100, null=False)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(max_length=255, unique=True, null=False)
    role = models.CharField(max_length=50, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_staff = models.BooleanField(default=False)  # Necesario para la administración de Django
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

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
