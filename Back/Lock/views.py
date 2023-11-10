from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework import permissions, mixins, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.authtoken.models import Token

from Lock.models import Terminal, Device
from Lock.serializers import UserSerializer, TerminalSerializer, DeviceSerializer, RegisterSerializer

class UserViewSet(ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class TerminalViewSet(ModelViewSet):
    queryset = Terminal.objects.all()
    serializer_class = TerminalSerializer
    permission_classes = [permissions.IsAdminUser]

class DeviceViewSet(ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    permission_classes = [permissions.IsAdminUser]

class RegisterView(GenericViewSet, mixins.CreateModelMixin,):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(APIView):
    permission_classes = (permissions.AllowAny)

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            token = Token.objects.get(user=user)
            return Response(token.key, status=status.HTTP_200_OK)
            
        return Response(status=status.HTTP_401_UNAUTHORIZED)

class SetupTerminalView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            token = Token.objects.get(user=user)
            return Response(token.key, status=status.HTTP_200_OK)
            
        return Response(status=status.HTTP_401_UNAUTHORIZED)

import time
class TriggerView(APIView):   
    def post(self, request):
        devices = Device.objects.filter(guid=request.data['device_guid'])

        if len(devices) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)

        device = devices[0]
        user_terminals = list(request.user.terminals.all())
        user_devices = [dev for terminal in user_terminals for dev in terminal.devices.all()]

        if device not in user_devices:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        device.status = 2
        device.save()

        time.sleep(1)

        return Response(status=status.HTTP_200_OK) 

class StatusView(APIView):
    def post(self, request):
        terminals = Terminal.objects.filter(guid=request.data['terminal_guid'])

        if len(terminals) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)

        terminal = terminals[0]
        user_terminals = list(request.user.terminals.all())

        if terminal not in user_terminals:
            return Response(status=status.HTTP_403_FORBIDDEN)

        device_status = {str(device.guid): device.status for device in terminal.devices.all()}
        return Response(device_status, status=status.HTTP_200_OK)        



