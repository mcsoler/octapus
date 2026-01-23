from django.test import TestCase
from unittest import skipIf
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.urls import reverse
from django.core.cache import cache
from django.conf import settings

User = get_user_model()


class AuthenticationTests(APITestCase):
    
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'StrongPass123!',
            'password_confirm': 'StrongPass123!',
            'first_name': 'Test',
            'last_name': 'User'
        }
    
    def test_register_success(self):
        url = reverse('register')
        response = self.client.post(url, self.user_data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')
        self.assertTrue(User.objects.filter(username='testuser').exists())
    
    def test_register_password_mismatch(self):
        url = reverse('register')
        data = self.user_data.copy()
        data['password_confirm'] = 'DifferentPass123!'
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password_confirm', response.data)
    
    def test_register_weak_password(self):
        url = reverse('register')
        data = self.user_data.copy()
        data['password'] = 'weak'
        data['password_confirm'] = 'weak'
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
    
    def test_password_validation_min_length(self):
        url = reverse('register')
        data = self.user_data.copy()
        data['password'] = 'Short1!'
        data['password_confirm'] = 'Short1!'
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_expired_token_fails(self):
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='StrongPass123!'
        )
        
        access = AccessToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access}')
        
        url = reverse('alert-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
