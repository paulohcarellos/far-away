from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.serializers import ModelSerializer, HyperlinkedModelSerializer, CharField, EmailField, HyperlinkedRelatedField, ValidationError
from rest_framework.validators import UniqueValidator
from Lock.models import Terminal

class UserSerializer(HyperlinkedModelSerializer):
    terminals = HyperlinkedRelatedField(many=True, read_only=True, view_name='terminal-detail')

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'terminals']

class TerminalSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Terminal
        fields = ['guid', 'user', 'status']

class RegisterSerializer(ModelSerializer):
    first_name = CharField(required=True)
    last_name = CharField(required=True)
    email = EmailField(required=True, validators=[UniqueValidator(queryset=User.objects.all())])
    password = CharField(write_only=True, required=True)
    password_confirm = CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'password_confirm']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise ValidationError({"password": "Password fields didn't match."})
        
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

        Token.objects.create(user=user)

        return user
