from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from auriga.models import User
from . import serializers


@api_view(['POST', 'HEAD'])
def auth_sign_up(request):
    """
    API endpoint that signs up a user if not already existing.
    """
    serializer = serializers.UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        if request.method == 'POST':
            serializer.save()
            data = serializer.data
            data.pop('password')
            return Response(data, status=status.HTTP_201_CREATED)
        elif request.method == 'HEAD':
            return Response(content_type='text/json',
                            headers=('content-length', len(serializer.data)),
                            status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST', 'HEAD'])
def auth_login(request):
    """
    API endpoint that logs in the user if the email and password combination
    is correct.
    """
    email = request.data.get('email', None)
    password = request.data.get('password', None)
    user_type = request.data.get('user_type', None)
    if email is None:
        return Response({'detail': 'email field is required.'},
                        status=status.HTTP_400_BAD_REQUEST)
    if password is None:
        return Response({'detail': 'password field is required.'},
                        status=status.HTTP_400_BAD_REQUEST)
    if user_type is None:
        return Response({'detail': 'user_type field is required.'},
                        status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'POST':
        user = authenticate(username=email, password=password)
        if user is not None:
            if user.is_active and user.user_type == user_type:
                login(request, user)
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(data={
                    'detail': 'You are not authorized to access this page.'},
                    status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(data={
                'detail': 'Email and password combination is incorrect.'},
                status=status.HTTP_401_UNAUTHORIZED)
    elif request.method == 'HEAD':
        return Response(status=status.HTTP_200_OK)


@api_view(['POST', 'HEAD'])
@permission_classes((IsAuthenticated,))
def auth_logout(request):
    """
    API endpoint that logs in the user if the email and password combination
    is correct.
    """
    if request.method == 'POST':
        logout(request)
        return Response(status=status.HTTP_200_OK)
    elif request.method == 'HEAD':
        return Response(status=status.HTTP_200_OK)


@api_view(['GET', 'HEAD'])
@permission_classes((IsAuthenticated,))
def get_mentors(request):
    """
    API endpoint that allows mentors to be viewed.
    """
    if request.user.user_type == 'mentee':
        mentors = User.objects.filter(user_type='mentor')
        serializer = serializers.UserSerializer(mentors, many=True)
        if request.method == 'GET':
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif request.method == 'HEAD':
            return Response(content_type='text/json',
                            headers=('content-length', len(serializer.data)),
                            status=status.HTTP_200_OK)
    else:
        return Response(
            data={'detail': 'Only mentees can access this resource.'},
            status=status.HTTP_403_FORBIDDEN)


@api_view(['GET', 'HEAD'])
@permission_classes((IsAuthenticated,))
def get_mentees(request):
    """
    API endpoint that allows mentees to be viewed.
    """
    if request.user.user_type == 'mentor':
        mentees = User.objects.filter(user_type='mentee')
        serializer = serializers.UserSerializer(mentees, many=True)
        if request.method == 'GET':
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif request.method == 'HEAD':
            return Response(content_type='text/json',
                            headers=('content-length', len(serializer.data)),
                            status=status.HTTP_200_OK)
    else:
        return Response(
            data={'detail': 'Only mentors can access this resource.'},
            status=status.HTTP_403_FORBIDDEN)
