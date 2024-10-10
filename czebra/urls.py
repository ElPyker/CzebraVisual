from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Endpoint para obtener el token JWT
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Endpoint para refrescar el token JWT
    path('api-auth/', include('rest_framework.urls')),  # Para autenticación basada en sesión
    path('api/users/', include('users.urls')),
    path('api/requests/', include('requests.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
