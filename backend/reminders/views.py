from django.conf import settings
from rest_framework import generics, serializers
from rest_framework.response import Response

from .models import Reminder
from .serializers import ReminderSerializer


class ReminderListCreateView(generics.ListCreateAPIView):
    serializer_class = ReminderSerializer

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        if user.credits < settings.REMINDER_CREDIT_COST:
            raise serializers.ValidationError({"detail": "Insufficient credits."})
        user.credits -= settings.REMINDER_CREDIT_COST
        user.save(update_fields=["credits"])
        serializer.save(user=user)


class ReminderDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ReminderSerializer

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user)

    def perform_destroy(self, instance):
        if instance.status == Reminder.Status.PENDING:
            self.request.user.credits += settings.REMINDER_CREDIT_COST
            self.request.user.save(update_fields=["credits"])
        instance.delete()
