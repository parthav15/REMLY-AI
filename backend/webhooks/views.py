import logging
from datetime import timedelta

from django.conf import settings
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from reminders.models import Reminder

logger = logging.getLogger(__name__)

TOOL_SNOOZE_REMINDER = "snooze_reminder"
RETELL_STATUS_COMPLETED = "completed"
RETELL_STATUS_FAILED = ("failed", "no-answer")


class RetellToolWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        tool_name = request.data.get("tool_name", "")
        args = request.data.get("args", {})
        call_id = request.data.get("call_id", "")

        if tool_name == TOOL_SNOOZE_REMINDER:
            return self._handle_snooze(call_id, args)

        return Response({"result": f"Unknown tool: {tool_name}"}, status=status.HTTP_400_BAD_REQUEST)

    def _handle_snooze(self, call_id, args):
        minutes = int(args.get("minutes", settings.DEFAULT_SNOOZE_MINUTES))
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
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        call_id = request.data.get("call_id", "")
        call_status = request.data.get("status", "")

        try:
            reminder = Reminder.objects.get(retell_call_id=call_id)
        except Reminder.DoesNotExist:
            logger.warning("Status update for unknown call_id: %s", call_id)
            return Response({"detail": "ok"})

        if call_status == RETELL_STATUS_COMPLETED:
            reminder.status = Reminder.Status.ANSWERED
        elif call_status in RETELL_STATUS_FAILED:
            reminder.status = Reminder.Status.MISSED

        reminder.save(update_fields=["status", "updated_at"])

        if reminder.is_recurring and reminder.status == Reminder.Status.ANSWERED:
            Reminder.objects.create(
                user=reminder.user,
                message=reminder.message,
                scheduled_at=reminder.scheduled_at + timedelta(days=settings.RECURRENCE_INTERVAL_DAYS),
                is_recurring=True,
            )

        logger.info("Updated reminder %s status to %s", reminder.id, reminder.status)
        return Response({"detail": "ok"})
