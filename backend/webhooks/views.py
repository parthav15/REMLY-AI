import logging
from datetime import timedelta

from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from reminders.models import Reminder

logger = logging.getLogger(__name__)


class RetellToolWebhookView(APIView):
    """Handle Retell AI custom tool calls (e.g. snooze_reminder)."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        tool_name = request.data.get("tool_name", "")
        args = request.data.get("args", {})
        call_id = request.data.get("call_id", "")

        if tool_name == "snooze_reminder":
            return self._handle_snooze(call_id, args)

        return Response({"result": f"Unknown tool: {tool_name}"}, status=status.HTTP_400_BAD_REQUEST)

    def _handle_snooze(self, call_id, args):
        minutes = int(args.get("minutes", 10))
        try:
            reminder = Reminder.objects.get(retell_call_id=call_id)
        except Reminder.DoesNotExist:
            logger.warning("Snooze request for unknown call_id: %s", call_id)
            return Response({"result": "Reminder not found."}, status=status.HTTP_404_NOT_FOUND)

        reminder.scheduled_at = timezone.now() + timedelta(minutes=minutes)
        reminder.status = Reminder.Status.PENDING
        reminder.retell_call_id = ""
        reminder.save(update_fields=["scheduled_at", "status", "retell_call_id", "updated_at"])

        logger.info("Snoozed reminder %s for %d minutes", reminder.id, minutes)
        return Response({"result": f"Successfully rescheduled in {minutes} minutes."})


class RetellStatusWebhookView(APIView):
    """Handle Retell AI call status updates."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        call_id = request.data.get("call_id", "")
        call_status = request.data.get("status", "")

        try:
            reminder = Reminder.objects.get(retell_call_id=call_id)
        except Reminder.DoesNotExist:
            logger.warning("Status update for unknown call_id: %s", call_id)
            return Response({"detail": "ok"})

        if call_status == "completed":
            reminder.status = Reminder.Status.ANSWERED
        elif call_status in ("failed", "no-answer"):
            reminder.status = Reminder.Status.MISSED

        reminder.save(update_fields=["status", "updated_at"])

        # Handle recurring: reset to next day if recurring and answered
        if reminder.is_recurring and reminder.status == Reminder.Status.ANSWERED:
            Reminder.objects.create(
                user=reminder.user,
                message=reminder.message,
                scheduled_at=reminder.scheduled_at + timedelta(days=1),
                is_recurring=True,
            )

        logger.info("Updated reminder %s status to %s", reminder.id, reminder.status)
        return Response({"detail": "ok"})
