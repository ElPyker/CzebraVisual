from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('Users.urls')),  # Incluye las URLs de la app Users
    path('api/requests/', include('Requests.urls')),  # Incluye las URLs de la app Requests
]
