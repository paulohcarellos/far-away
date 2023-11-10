from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework import permissions, mixins, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.authtoken.models import Token
from Lock.models import Terminal
from Lock.serializers import UserSerializer, TerminalSerializer, RegisterSerializer

class UserViewSet(ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class TerminalViewSet(ModelViewSet):
    queryset = Terminal.objects.all()
    serializer_class = TerminalSerializer
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

class SetupView(APIView):
    def get(self, request, guid, secret):
        terminals = Terminal.objects.filter(guid=guid, secret=secret)

        if len(terminals) == 0:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        terminal = terminals[0]
        terminal.user = request.user
        terminal.status = '00'
        terminal.save()

        return Response(status=status.HTTP_200_OK)

import time
class TriggerView(APIView):   
    def post(self, request):
        terminals = Terminal.objects.filter(guid=request.data['terminal_guid'])

        if len(terminals) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)

        terminal = terminals[0]
        user_terminals = list(request.user.terminals.all())

        if terminal not in user_terminals:
            return Response(status=status.HTTP_403_FORBIDDEN)

        terminal_status = list(terminal.status)
        terminal_status[int(request.data['index'])] = '1'

        terminal.status = ''.join(terminal_status)
        terminal.save()

        time.sleep(1)

        return Response(status=status.HTTP_200_OK)
    

class UpdateView(APIView):   
    def post(self, request):
        terminals = Terminal.objects.filter(guid=request.data['terminal_guid'])

        if len(terminals) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)

        terminal = terminals[0]
        user_terminals = list(request.user.terminals.all())

        if terminal not in user_terminals:
            return Response(status=status.HTTP_403_FORBIDDEN)

        terminal.status = request.data['status']
        terminal.save()

        time.sleep(1)

        return Response(status=status.HTTP_200_OK) 

class PollView(APIView):
    def post(self, request):
        terminals = Terminal.objects.filter(guid=request.data['terminal_guid'])

        if len(terminals) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)

        terminal = terminals[0]
        user_terminals = list(request.user.terminals.all())

        if terminal not in user_terminals:
            return Response(status=status.HTTP_403_FORBIDDEN)

        return Response(terminal.status, status=status.HTTP_200_OK)        



