from django.urls import path

from . import views

urlpatterns = [
    path("", views.ReminderListCreateView.as_view(), name="reminder-list-create"),
    path("<uuid:pk>/", views.ReminderDetailView.as_view(), name="reminder-detail"),
]
