from django.db import models
from django.conf import settings  # Para referenciar el modelo de usuarios

class Company(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    company_id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=20, unique=True, null=False)
    name = models.CharField(max_length=255, null=False)
    phone = models.CharField(max_length=20, null=True, blank=True)
    abbreviation = models.CharField(max_length=10, null=True, blank=True)
    registration_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    email = models.EmailField(max_length=255, null=True, blank=True)
    website = models.URLField(max_length=255, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    postal_code = models.CharField(max_length=20, null=True, blank=True)
    responsible = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.name


class Request(models.Model):
    REQUEST_TYPE_CHOICES = [
        ('Graphic Design', 'Graphic Design'),
        ('Branding', 'Branding'),
        ('Promotional Video', 'Promotional Video'),
        ('Digital Campaigns', 'Digital Campaigns'),
        ('Web Design and Development', 'Web Design and Development'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    request_id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=20, unique=True, null=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL)
    company = models.ForeignKey(Company, null=True, on_delete=models.SET_NULL)
    request_date = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255, null=False)
    name = models.CharField(max_length=255, null=True, blank=True)
    request_type = models.CharField(max_length=50, choices=REQUEST_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    details = models.TextField(null=True, blank=True)
    desired_delivery_date = models.DateField(null=True, blank=True)
    files = models.JSONField(null=True, blank=True)  # Assuming files are stored as JSON array of file paths/URLs
    is_urgent = models.BooleanField(default=False)

    def __str__(self):
        return self.title
