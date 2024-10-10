from rest_framework import viewsets
from .models import User, Notification, Division, DivisionUser
from .serializers import UserSerializer, NotificationSerializer, DivisionSerializer, DivisionUserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

class DivisionViewSet(viewsets.ModelViewSet):
    queryset = Division.objects.all()
    serializer_class = DivisionSerializer

class DivisionUserViewSet(viewsets.ModelViewSet):
    queryset = DivisionUser.objects.all()
    serializer_class = DivisionUserSerializer
