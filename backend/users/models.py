import uuid

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models


class Country(models.Model):
    name = models.CharField(max_length=100)
    iso_code = models.CharField(max_length=2, unique=True)
    calling_code = models.CharField(max_length=10)
    flag = models.CharField(max_length=10)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "users_country"
        ordering = ["name"]
        verbose_name_plural = "countries"

    def __str__(self):
        return f"{self.flag} {self.name} ({self.calling_code})"


class CountryTimezone(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name="timezones")
    timezone = models.CharField(max_length=50)

    class Meta:
        db_table = "users_countrytimezone"
        unique_together = [("country", "timezone")]
        ordering = ["timezone"]

    def __str__(self):
        return self.timezone


class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone_number = models.CharField(max_length=16, unique=True)
    timezone = models.CharField(max_length=50, default=settings.DEFAULT_TIMEZONE)
    credits = models.IntegerField(default=settings.DEFAULT_USER_CREDITS)
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True, blank=True, related_name="users")

    USERNAME_FIELD = "phone_number"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        db_table = "users_customuser"

    def __str__(self):
        return self.phone_number
