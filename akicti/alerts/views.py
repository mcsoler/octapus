from rest_framework import viewsets, status, exceptions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone
import logging

from .models import Alert, Evidence
from .serializers import (
    AlertListSerializer,
    AlertDetailSerializer,
    EvidenceSerializer,
    EvidenceReviewSerializer,
)
from .permissions import IsOwnerOrAdmin

logger = logging.getLogger('auth')


class LoginRateThrottle(AnonRateThrottle):
    rate = '5/minute'


class RegisterRateThrottle(AnonRateThrottle):
    rate = '3/hour'


class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    permission_classes = [IsOwnerOrAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['severity', 'status']
    search_fields = ['title']
    ordering_fields = ['created_at', 'severity', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        if user.is_superuser or user.is_staff:
            return queryset
        
        if not user.is_authenticated:
            raise exceptions.PermissionDenied(
                detail='Authentication credentials were not provided.',
                code='not_authenticated'
            )
        
        return queryset.filter(owner=user)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return AlertListSerializer
        return AlertDetailSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        self.check_object_permissions(request, instance)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def evidences(self, request, pk=None):
        alert = self.get_object()
        self.check_object_permissions(request, alert)
        
        evidences = alert.evidences.all().order_by('-created_at')
        
        page = self.paginate_queryset(evidences)
        if page is not None:
            serializer = EvidenceSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = EvidenceSerializer(evidences, many=True)
        return Response(serializer.data)


class EvidenceViewSet(viewsets.ModelViewSet):
    queryset = Evidence.objects.all()
    permission_classes = [IsOwnerOrAdmin]
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action in ['partial_update', 'update']:
            return EvidenceReviewSerializer
        return EvidenceSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        if user.is_superuser or user.is_staff:
            return queryset
        
        alert_ids = Alert.objects.filter(owner=user).values_list('id', flat=True)
        return queryset.filter(alert_id__in=alert_ids)
    
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        self.check_object_permissions(request, instance)
        
        if 'is_reviewed' not in request.data:
            return Response(
                {'detail': 'Only is_reviewed field can be updated'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        is_reviewed = request.data.get('is_reviewed')
        if is_reviewed:
            logger.info(
                f'Evidence {instance.id} marked as reviewed by user {request.user.id}',
                extra={'user_id': request.user.id, 'evidence_id': instance.id}
            )
        
        serializer.save()
        return Response(serializer.data)
