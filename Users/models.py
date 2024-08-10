from django.db import models

class User(models.Model):
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
    password_hash = models.CharField(max_length=255, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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
