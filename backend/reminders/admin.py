from django.conf import settings
from django.contrib import admin

from .models import Reminder


@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ["user", "message_preview", "scheduled_at", "status", "is_recurring"]
    list_filter = ["status", "is_recurring"]
    search_fields = ["user__phone_number", "message"]
    readonly_fields = ["retell_call_id", "created_at", "updated_at"]

    def message_preview(self, obj):
        return obj.message[:settings.ADMIN_MESSAGE_PREVIEW_LENGTH]
    message_preview.short_description = "Message"
