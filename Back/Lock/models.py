from django.db import models
from django.contrib.auth.models import User
from uuid import uuid4
import random
import string

class Terminal(models.Model):
    guid = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    secret = models.CharField(max_length=72, default=lambda : ''.join(random.choice(string.ascii_letters) for i in range(72)))
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.PROTECT, related_name='terminals')
    status = models.CharField(max_length=2, default='0')
    schedulled = models.BooleanField(default=False)

class Task(models.Model):
    terminal = models.ForeignKey(Terminal, on_delete=models.CASCADE, related_name='tasks')
    time = models.DateTimeField()
