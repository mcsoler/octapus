from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlertViewSet, EvidenceViewSet

router = DefaultRouter()
router.register(r'alerts', AlertViewSet, basename='alert')
router.register(r'evidences', EvidenceViewSet, basename='evidence')

urlpatterns = [
    path('', include(router.urls)),
]