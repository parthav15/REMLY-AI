import logging

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from reminders.models import Reminder

logger = logging.getLogger(__name__)


def trigger_retell_call(reminder):
    from retell import Retell

    client = Retell(api_key=settings.RETELL_API_KEY)

    response = client.call.create_phone_call(
        from_number=settings.RETELL_FROM_NUMBER,
        to_number=reminder.user.phone_number,
        override_agent_id=settings.RETELL_AGENT_ID,
        retell_llm_dynamic_variables={
            "message": reminder.message,
        },
        metadata={
            "reminder_id": str(reminder.id),
        },
    )
    return response.call_id


class Command(BaseCommand):
    help = "Poll for due reminders and trigger Retell AI calls."

    def handle(self, *args, **kwargs):
        now = timezone.now()

        with transaction.atomic():
            due = (
                Reminder.objects.select_for_update(skip_locked=True)
                .filter(status=Reminder.Status.PENDING, scheduled_at__lte=now)
            )

            count = 0
            for reminder in due:
                try:
                    call_id = trigger_retell_call(reminder)
                    reminder.retell_call_id = call_id
                    reminder.status = Reminder.Status.TRIGGERED
                    reminder.save(update_fields=["retell_call_id", "status", "updated_at"])
                    count += 1
                    logger.info("Triggered call %s for reminder %s", call_id, reminder.id)
                except Exception:
                    logger.exception("Failed to trigger reminder %s", reminder.id)

        self.stdout.write(self.style.SUCCESS(f"Triggered {count} call(s)."))
