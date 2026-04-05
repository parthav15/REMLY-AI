from django.urls import path

from . import views

urlpatterns = [
    path("retell/tool/", views.RetellToolWebhookView.as_view(), name="retell-tool-webhook"),
    path("retell/status/", views.RetellStatusWebhookView.as_view(), name="retell-status-webhook"),
]
