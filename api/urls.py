from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'auth/signup/$', views.auth_sign_up),
    url(r'auth/login/$', views.auth_login),
    url(r'auth/logout/$', views.auth_logout),
    url(r'getmentors/$', views.get_mentors),
    url(r'getmentees/$', views.get_mentees),
]
