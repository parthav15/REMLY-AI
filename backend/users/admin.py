from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Country, CountryTimezone, CustomUser


class CountryTimezoneInline(admin.TabularInline):
    model = CountryTimezone
    extra = 1


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ["flag", "name", "iso_code", "calling_code", "is_active"]
    list_filter = ["is_active"]
    search_fields = ["name", "iso_code", "calling_code"]
    inlines = [CountryTimezoneInline]


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ["phone_number", "country", "credits", "timezone", "is_active", "date_joined"]
    search_fields = ["phone_number"]
    ordering = ["-date_joined"]
    fieldsets = UserAdmin.fieldsets + (
        ("Remly", {"fields": ("phone_number", "timezone", "credits", "country")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Remly", {"fields": ("phone_number", "timezone", "country")}),
    )
