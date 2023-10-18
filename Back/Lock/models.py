from django.db import models
from django.contrib.auth.models import User
from uuid import uuid4

class Terminal(models.Model):
    guid = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='terminals')

class Device(models.Model):
    STATUS_CHOICES = [
        (0, "CLOSED"),
        (1, "OPENING"),
        (2, "OPENED")
    ]

    guid = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    terminal = models.ForeignKey(Terminal, on_delete=models.PROTECT, related_name='devices')
    status = models.IntegerField(choices=STATUS_CHOICES)
