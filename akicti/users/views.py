from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth import get_user_model, authenticate
from django.conf import settings
import logging

from .serializers import RegisterSerializer, UserSerializer
from .throttling import LoginRateThrottle, RegisterRateThrottle

User = get_user_model()
logger = logging.getLogger('auth')


class RegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [RegisterRateThrottle]
    
    def get_throttles(self):
        if hasattr(settings, 'TESTING') and settings.TESTING:
            return []
        return [RegisterRateThrottle()]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            refresh = RefreshToken.for_user(user)
            
            logger.info(f'New user registered: {user.username}', extra={'user_id': user.id})
            
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(TokenObtainPairView):
    throttle_classes = [LoginRateThrottle]
    
    def get_throttles(self):
        if hasattr(settings, 'TESTING') and settings.TESTING:
            return []
        return [LoginRateThrottle()]
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == status.HTTP_200_OK:
            username = request.data.get('username')
            user = User.objects.filter(username=username).first()
            if user:
                logger.info(f'User logged in: {username}', extra={'user_id': user.id})
        
        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response(
                    {'detail': 'Refresh token is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            logger.info(
                f'User logged out: {request.user.username}',
                extra={'user_id': request.user.id}
            )
            
            return Response(
                {'detail': 'Successfully logged out'},
                status=status.HTTP_200_OK
            )
        except (TokenError, InvalidToken) as e:
            return Response(
                {'detail': 'Invalid or expired refresh token'},
                status=status.HTTP_400_BAD_REQUEST
            )


class CustomTokenRefreshView(TokenRefreshView):
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == status.HTTP_200_OK:
            logger.info('Token refreshed successfully', extra={'user_id': request.user.id})
        
        return response


class CustomTokenVerifyView(TokenVerifyView):
    
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)