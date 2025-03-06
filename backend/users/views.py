from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import CustomUserSerializer, RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import *
from django.shortcuts import get_object_or_404


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User created successfully"})
        return Response(serializer.errors, status=400)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        if 'user_profile' in request.FILES:
            user.user_profile = request.FILES['user_profile']
            user.save()
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)
    

class AdminUsersView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        users = CustomUser.objects.filter(is_superuser=False)
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data)
    
    def put(self, request, user_id):
            user = get_object_or_404(CustomUser, id=user_id)
            serializer = CustomUserSerializer(user, data = request.data, partial = True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
    
    def delete(self, request, user_id):
        user = get_object_or_404(CustomUser,id=user_id)
        user.delete()
        return Response({"message":"User deleted successfully"},status=204)
