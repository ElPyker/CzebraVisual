from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, RequestViewSet

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'requests', RequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
