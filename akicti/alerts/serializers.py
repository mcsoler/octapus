from rest_framework import serializers
from django.utils import timezone
from .models import Alert, Evidence


class EvidenceSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Evidence
        fields = ['id', 'source', 'summary', 'is_reviewed', 'created_at', 'reviewed_by', 'reviewed_at']
        read_only_fields = ['id', 'created_at', 'reviewed_by', 'reviewed_at']


class AlertListSerializer(serializers.ModelSerializer):
    evidences_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Alert
        fields = ['id', 'title', 'severity', 'status', 'created_at', 'owner', 'evidences_count']
        read_only_fields = ['id', 'created_at', 'owner']
    
    def get_evidences_count(self, obj):
        return obj.evidences.count()


class AlertDetailSerializer(serializers.ModelSerializer):
    evidences = EvidenceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Alert
        fields = ['id', 'title', 'severity', 'status', 'created_at', 'owner', 'evidences']
        read_only_fields = ['id', 'created_at', 'owner']


class EvidenceReviewSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Evidence
        fields = ['is_reviewed', 'reviewed_by', 'reviewed_at']
        read_only_fields = ['reviewed_by', 'reviewed_at']
    
    def update(self, instance, validated_data):
        is_reviewed = validated_data.get('is_reviewed', instance.is_reviewed)
        
        if is_reviewed and not instance.is_reviewed:
            instance.is_reviewed = True
            instance.reviewed_by = self.context['request'].user
            instance.reviewed_at = timezone.now()
        elif not is_reviewed:
            instance.is_reviewed = False
            instance.reviewed_by = None
            instance.reviewed_at = None
        
        instance.save()
        return instance