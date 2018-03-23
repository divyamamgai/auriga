from django.urls import path

from . import views

app_name = 'mentor'

urlpatterns = [
    path(r'', views.index, name='index'),
    path(r'dashboard', views.dashboard, name='dashboard'),
]
