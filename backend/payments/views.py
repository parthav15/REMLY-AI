import logging

import razorpay
from django.conf import settings
from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Payment
from .serializers import (
    CreateOrderSerializer,
    PaymentSerializer,
    PlanSerializer,
    VerifyPaymentSerializer,
)

logger = logging.getLogger(__name__)


def get_razorpay_client():
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


def get_plan(plan_id):
    for plan in settings.CREDIT_PLANS:
        if plan["id"] == plan_id:
            return plan
    return None


class PlanListView(APIView):
    def get(self, request):
        serializer = PlanSerializer(settings.CREDIT_PLANS, many=True)
        return Response(serializer.data)


class CreateOrderView(APIView):
    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        plan = get_plan(serializer.validated_data["plan_id"])
        if not plan:
            return Response(
                {"detail": "Invalid plan."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        client = get_razorpay_client()
        order = client.order.create({
            "amount": plan["amount_paise"],
            "currency": "INR",
            "notes": {
                "user_id": str(request.user.id),
                "plan_id": plan["id"],
            },
        })

        Payment.objects.create(
            user=request.user,
            plan_id=plan["id"],
            credits=plan["credits"],
            amount_paise=plan["amount_paise"],
            razorpay_order_id=order["id"],
        )

        return Response({
            "order_id": order["id"],
            "amount": plan["amount_paise"],
            "currency": "INR",
            "key_id": settings.RAZORPAY_KEY_ID,
            "plan": plan,
        })


class VerifyPaymentView(APIView):
    def post(self, request):
        serializer = VerifyPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            payment = Payment.objects.get(
                razorpay_order_id=data["razorpay_order_id"],
                user=request.user,
                status=Payment.Status.CREATED,
            )
        except Payment.DoesNotExist:
            return Response(
                {"detail": "Order not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        client = get_razorpay_client()
        try:
            client.utility.verify_payment_signature({
                "razorpay_order_id": data["razorpay_order_id"],
                "razorpay_payment_id": data["razorpay_payment_id"],
                "razorpay_signature": data["razorpay_signature"],
            })
        except razorpay.errors.SignatureVerificationError:
            payment.status = Payment.Status.FAILED
            payment.save(update_fields=["status", "updated_at"])
            logger.warning("Payment signature verification failed: %s", payment.id)
            return Response(
                {"detail": "Payment verification failed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            payment.razorpay_payment_id = data["razorpay_payment_id"]
            payment.razorpay_signature = data["razorpay_signature"]
            payment.status = Payment.Status.PAID
            payment.save(update_fields=[
                "razorpay_payment_id",
                "razorpay_signature",
                "status",
                "updated_at",
            ])

            request.user.credits += payment.credits
            request.user.save(update_fields=["credits"])

        logger.info("Payment %s verified. Added %d credits to user %s", payment.id, payment.credits, request.user.id)
        return Response({
            "detail": "Payment successful.",
            "credits_added": payment.credits,
            "total_credits": request.user.credits,
        })


class PaymentHistoryView(APIView):
    def get(self, request):
        payments = Payment.objects.filter(user=request.user, status=Payment.Status.PAID)
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)
