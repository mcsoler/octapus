from django.contrib import admin
from .models import Alert, Evidence


@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ['title', 'severity', 'status', 'owner', 'created_at']
    list_filter = ['severity', 'status', 'created_at']
    search_fields = ['title', 'owner__username']
    ordering = ['-created_at']
    readonly_fields = ['created_at']


@admin.register(Evidence)
class EvidenceAdmin(admin.ModelAdmin):
    list_display = ['alert', 'source', 'is_reviewed', 'reviewed_by', 'reviewed_at', 'created_at']
    list_filter = ['source', 'is_reviewed', 'created_at']
    search_fields = ['summary', 'alert__title', 'reviewed_by__username']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'reviewed_at']
