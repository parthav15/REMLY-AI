from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from .models import CustomUser


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ["phone_number", "timezone", "password"]

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data["phone_number"],
            phone_number=validated_data["phone_number"],
            timezone=validated_data.get("timezone", "UTC"),
            password=validated_data["password"],
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
    class Meta:
        model = CustomUser
        fields = ["id", "phone_number", "timezone", "credits"]
        read_only_fields = ["id", "credits"]
