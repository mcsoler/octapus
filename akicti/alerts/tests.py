from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse
from django.utils import timezone
from .models import Alert, Evidence

User = get_user_model()


class AlertTests(APITestCase):
    
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='user1',
            email='user1@test.com',
            password='TestPass123!'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            email='user2@test.com',
            password='TestPass123!'
        )
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@test.com',
            password='AdminPass123!',
            is_staff=True,
            is_superuser=True
        )
        
        self.alert1 = Alert.objects.create(
            title='Alert 1',
            severity='high',
            status='open',
            owner=self.user1
        )
        
        self.alert2 = Alert.objects.create(
            title='Alert 2',
            severity='medium',
            status='closed',
            owner=self.user2
        )
        
        self.evidence1 = Evidence.objects.create(
            alert=self.alert1,
            source='twitter',
            summary='Test evidence',
            is_reviewed=False
        )
        
        self.user1_token = RefreshToken.for_user(self.user1)
        self.admin_token = RefreshToken.for_user(self.admin_user)
    
    def test_alert_list_only_owner_alerts(self):
        url = reverse('alert-list')
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.user1_token.access_token}'
        )
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], self.alert1.id)
    
    def test_alert_list_all_for_admin(self):
        url = reverse('alert-list')
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.admin_token.access_token}'
        )
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
    
    def test_alert_list_filters(self):
        url = reverse('alert-list')
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.admin_token.access_token}'
        )
        response = self.client.get(url, {'severity': 'high'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['severity'], 'high')
    
    def test_alert_list_search(self):
        url = reverse('alert-list')
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.admin_token.access_token}'
        )
        response = self.client.get(url, {'search': 'Alert 1'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Alert 1')
    
    def test_alert_list_pagination(self):
        url = reverse('alert-list')
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.user1_token.access_token}'
        )
        response = self.client.get(url, {'page': 1, 'page_size': 1})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertIsNotNone(response.data['count'])
    
    def test_alert_detail_owner_access(self):
        url = reverse('alert-detail', kwargs={'pk': self.alert1.id})
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.user1_token.access_token}'
        )
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.alert1.id)
    
    def test_alert_detail_other_user_forbidden(self):
        url = reverse('alert-detail', kwargs={'pk': self.alert2.id})
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.user1_token.access_token}'
        )
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_alert_detail_admin_access(self):
        url = reverse('alert-detail', kwargs={'pk': self.alert1.id})
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.admin_token.access_token}'
        )
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_alert_evidences_list(self):
        url = reverse('alert-evidences', kwargs={'pk': self.alert1.id})
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.user1_token.access_token}'
        )
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_create_alert(self):
        url = reverse('alert-list')
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.user1_token.access_token}'
        )
        data = {
            'title': 'New Alert',
            'severity': 'critical',
            'status': 'open'
        }
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Alert.objects.count(), 3)
        self.assertEqual(Alert.objects.get(id=response.data['id']).owner, self.user1)


class EvidenceTests(APITestCase):
    
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='user1',
            email='user1@test.com',
            password='TestPass123!'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            email='user2@test.com',
            password='TestPass123!'
        )
        
        self.alert1 = Alert.objects.create(
            title='Alert 1',
            severity='high',
            status='open',
            owner=self.user1
        )
        
        self.alert2 = Alert.objects.create(
            title='Alert 2',
            severity='medium',
            status='closed',
            owner=self.user2
        )
        
        self.evidence1 = Evidence.objects.create(
            alert=self.alert1,
            source='twitter',
            summary='Test evidence',
            is_reviewed=False
        )
        
        self.user1_token = RefreshToken.for_user(self.user1)
    
    def test_patch_evidence_owner_access(self):
        url = reverse('evidence-detail', kwargs={'pk': self.evidence1.id})
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.user1_token.access_token}'
        )
        data = {'is_reviewed': True}
        response = self.client.patch(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.evidence1.refresh_from_db()
        self.assertTrue(self.evidence1.is_reviewed)
        self.assertEqual(self.evidence1.reviewed_by, self.user1)
        self.assertIsNotNone(self.evidence1.reviewed_at)
    
    def test_patch_evidence_reviewer_set(self):
        url = reverse('evidence-detail', kwargs={'pk': self.evidence1.id})
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.user1_token.access_token}'
        )
        data = {'is_reviewed': True}
        response = self.client.patch(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['reviewed_by'], self.user1.id)
        self.assertIsNotNone(response.data['reviewed_at'])
    
    def test_patch_evidence_unreview(self):
        self.evidence1.is_reviewed = True
        self.evidence1.reviewed_by = self.user1
        self.evidence1.reviewed_at = timezone.now()
        self.evidence1.save()
        
        url = reverse('evidence-detail', kwargs={'pk': self.evidence1.id})
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.user1_token.access_token}'
        )
        data = {'is_reviewed': False}
        response = self.client.patch(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.evidence1.refresh_from_db()
        self.assertFalse(self.evidence1.is_reviewed)
        self.assertIsNone(self.evidence1.reviewed_by)
        self.assertIsNone(self.evidence1.reviewed_at)
    
    def test_patch_evidence_only_reviewed_field_allowed(self):
        url = reverse('evidence-detail', kwargs={'pk': self.evidence1.id})
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.user1_token.access_token}'
        )
        data = {'summary': 'Updated summary'}
        response = self.client.patch(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.evidence1.refresh_from_db()
        self.assertEqual(self.evidence1.summary, 'Test evidence')
