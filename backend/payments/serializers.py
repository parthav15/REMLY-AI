from rest_framework import serializers

from .models import Payment


class PlanSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    credits = serializers.IntegerField()
    amount_paise = serializers.IntegerField()
    display_price = serializers.CharField()


class CreateOrderSerializer(serializers.Serializer):
    plan_id = serializers.CharField()


class VerifyPaymentSerializer(serializers.Serializer):
    razorpay_order_id = serializers.CharField()
    razorpay_payment_id = serializers.CharField()
    razorpay_signature = serializers.CharField()


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "id",
            "plan_id",
            "credits",
            "amount_paise",
            "status",
            "razorpay_order_id",
            "created_at",
        ]
