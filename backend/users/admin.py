from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ["phone_number", "credits", "timezone", "is_active", "date_joined"]
    search_fields = ["phone_number"]
    ordering = ["-date_joined"]
    fieldsets = UserAdmin.fieldsets + (
        ("Remly", {"fields": ("phone_number", "timezone", "credits")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Remly", {"fields": ("phone_number", "timezone")}),
    )
