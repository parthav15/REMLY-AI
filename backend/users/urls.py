from django.urls import path

from . import views

urlpatterns = [
    path("countries/", views.CountryListView.as_view(), name="country-list"),
    path("register/", views.RegisterView.as_view(), name="register"),
    path("login/", views.LoginView.as_view(), name="login"),
    path("me/", views.MeView.as_view(), name="me"),
]
