from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include("users.urls")),
    path("api/v1/reminders/", include("reminders.urls")),
    path("api/v1/webhooks/", include("webhooks.urls")),
    path("api/v1/payments/", include("payments.urls")),
]
