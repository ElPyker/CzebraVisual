from django.db import models
from django.conf import settings

class Company(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    company_id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=20, unique=True, null=False, blank=True)  # No usar default aquí
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
    responsible = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL, related_name='owned_companies')

    def save(self, *args, **kwargs):
        if not self.code:  # Solo generar si no tiene un código
            self.code = f"{self.abbreviation.upper()}-001" if self.abbreviation else "NOABBR-001"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Request(models.Model):
    REQUEST_TYPE_CHOICES = [
        ('DG', 'Graphic Design'),
        ('B', 'Branding'),
        ('PV', 'Promotional Video'),
        ('DC', 'Digital Campaigns'),
        ('WD', 'Web Design and Development'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    request_id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=20, unique=True, null=False, blank=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        on_delete=models.SET_NULL
    )
    company = models.ForeignKey(
        'Company',
        null=True,
        on_delete=models.SET_NULL
    )
    request_date = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255, null=False)
    name = models.CharField(max_length=255, null=True, blank=True)
    request_type = models.CharField(max_length=50, choices=REQUEST_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    details = models.TextField(null=True, blank=True)
    desired_delivery_date = models.DateField(null=True, blank=True)
    file = models.FileField(upload_to='requests/', null=True, blank=True)
    file_type = models.CharField(max_length=10, choices=[('image', 'Image'), ('video', 'Video')], null=True, blank=True)
    is_urgent = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.code:
            request_type_abbr = dict(self.REQUEST_TYPE_CHOICES).get(self.request_type)
            request_id_formatted = str(self.request_id).zfill(4)
            if self.company and self.company.abbreviation:
                company_abbr = self.company.abbreviation.upper()
                self.code = f"{request_type_abbr}-{company_abbr}-{request_id_formatted}"
            else:
                self.code = f"{request_type_abbr}-{request_id_formatted}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
