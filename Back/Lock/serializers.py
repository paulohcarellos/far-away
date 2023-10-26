from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate, login
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from Lock.models import Terminal, Device
from uuid import UUID
import time

class UserSerializer(serializers.HyperlinkedModelSerializer):
    terminals = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'terminals']

class TerminalSerializer(serializers.HyperlinkedModelSerializer):
    devices = serializers.HyperlinkedRelatedField(many=True, read_only=True, view_name='device-detail')

    class Meta:
        model = Terminal
        fields = ['guid', 'user', 'devices']

class DeviceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Device
        fields = ['guid', 'terminal', 'status']

class RegisterSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True, validators=[UniqueValidator(queryset=User.objects.all())])
    password = serializers.CharField(write_only=True, required=True)
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'password_confirm']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        return attrs
    
    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
            )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
class TriggerSerializer(serializers.ModelSerializer):
    device_guid = serializers.UUIDField(required=True, write_only=True)
    success = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Device
        fields = ['device_guid', 'success']

    def create(self, data):
        device = Device.objects.get(guid=data['device_guid'])
        device.status = 2
        device.save()

        time.sleep(3)

        data['success'] = True
        return data
