import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone_number = models.CharField(max_length=15, unique=True, help_text="E.164 format, e.g. +1234567890")
    timezone = models.CharField(max_length=50, default="UTC", help_text="IANA timezone, e.g. Asia/Kolkata")
    credits = models.IntegerField(default=50, help_text="Call credits remaining")

    USERNAME_FIELD = "phone_number"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        db_table = "users_customuser"

    def __str__(self):
        return self.phone_number
