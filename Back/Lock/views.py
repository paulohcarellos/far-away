from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, mixins
from django.http import HttpResponse
from Lock.models import Terminal, Device
from Lock.serializers import UserSerializer, TerminalSerializer, DeviceSerializer, RegisterSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class TerminalViewSet(viewsets.ModelViewSet):
    queryset = Terminal.objects.all()
    serializer_class = TerminalSerializer
    permission_classes = [permissions.IsAuthenticated]

class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    permission_classes = [permissions.IsAuthenticated]

class RegisterView(viewsets.GenericViewSet, mixins.CreateModelMixin,):
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

def Trigger(request):
    permission_classes = [permissions.IsAuthenticated]
    return HttpResponse()