import uuid

from django.conf import settings
from django.db import models


class Reminder(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        TRIGGERED = "triggered", "Triggered"
        ANSWERED = "answered", "Answered"
        MISSED = "missed", "Missed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reminders",
    )
    message = models.TextField(help_text="What the AI will read out loud")
    scheduled_at = models.DateTimeField(help_text="Exact UTC time to place the call")
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    retell_call_id = models.CharField(max_length=255, blank=True, default="")
    is_recurring = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "reminders_reminder"
        ordering = ["scheduled_at"]
        indexes = [
            models.Index(fields=["status", "scheduled_at"]),
        ]

    def __str__(self):
        return f"{self.user.phone_number} — {self.message[:40]} @ {self.scheduled_at}"
