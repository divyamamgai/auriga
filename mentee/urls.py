from django.urls import path

from . import views

app_name = 'mentee'

urlpatterns = [
    path(r'', views.index, name='index'),
    path(r'dashboard', views.dashboard, name='dashboard'),
]
