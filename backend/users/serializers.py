from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import Country, CountryTimezone, CustomUser


class CountryTimezoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = CountryTimezone
        fields = ["timezone"]


class CountrySerializer(serializers.ModelSerializer):
    timezones = CountryTimezoneSerializer(many=True, read_only=True)

    class Meta:
        model = Country
        fields = ["id", "name", "iso_code", "calling_code", "flag", "timezones"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=settings.MIN_PASSWORD_LENGTH)
    country_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = ["phone_number", "timezone", "password", "country_id"]

    def validate(self, data):
        country_id = data.get("country_id")
        if country_id:
            try:
                country = Country.objects.get(id=country_id, is_active=True)
            except Country.DoesNotExist:
                raise serializers.ValidationError({"country_id": "Invalid country."})
            data["_country"] = country

            if not data.get("phone_number", "").startswith(country.calling_code):
                raise serializers.ValidationError(
                    {"phone_number": f"Phone number must start with {country.calling_code}"}
                )

            tz = data.get("timezone")
            if tz and not country.timezones.filter(timezone=tz).exists():
                raise serializers.ValidationError(
                    {"timezone": "Timezone does not belong to the selected country."}
                )

            if not tz:
                first_tz = country.timezones.first()
                if first_tz:
                    data["timezone"] = first_tz.timezone

        return data

    def create(self, validated_data):
        country = validated_data.pop("_country", None)
        country_id = validated_data.pop("country_id", None)
        user = CustomUser.objects.create_user(
            username=validated_data["phone_number"],
            phone_number=validated_data["phone_number"],
            timezone=validated_data.get("timezone", settings.DEFAULT_TIMEZONE),
            password=validated_data["password"],
            country=country,
        )
        return user


class LoginSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(username=data["phone_number"], password=data["password"])
        if not user:
            raise serializers.ValidationError("Invalid phone number or password.")
        data["user"] = user
        return data


class UserSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "phone_number", "timezone", "credits", "country", "date_joined"]
        read_only_fields = ["id", "credits", "country", "date_joined"]
