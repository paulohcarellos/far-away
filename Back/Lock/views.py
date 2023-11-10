from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, mixins, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.viewsets import ViewSet
from django.contrib.auth import authenticate, login
from Lock.models import Terminal, Device
from Lock.serializers import UserSerializer, TerminalSerializer, DeviceSerializer, RegisterSerializer
from django.views.decorators.csrf import csrf_exempt

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

class TerminalViewSet(viewsets.ModelViewSet):
    queryset = Terminal.objects.all()
    serializer_class = TerminalSerializer

class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer

class RegisterView(viewsets.GenericViewSet, mixins.CreateModelMixin,):
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)

class TriggerView(APIView):   
    def post(self, request):
        device = Device.objects.filter(guid=data['device_guid'])

        if len(device) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)

        device.status = 2
        device.save()

        time.sleep(3)

        return Response({"success": True}, status=status.HTTP_200_OK) 

class StatusView(APIView):
    def post(self, request):
        guid = request.data.get('guid')
        device = list(Device.objects.filter(guid=guid))

        user_terminals = list(request.user.terminals.all())
        user_devices = [list(terminal.devices.all()) for terminal in user_terminals]
        user_devices = [device for devices in user_devices for device in devices]

        print(user_devices)

        if len(device) == 0 or device not in user_devices:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(device[0].status, status=status.HTTP_200_OK)        

class LoginView(APIView):
    permission_classes = (permissions.AllowAny)

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            Token.objects.get(user=user)
            return Response(token.key, status=status.HTTP_200_OK)
            
        return Response(status=status.HTTP_401_UNAUTHORIZED)

