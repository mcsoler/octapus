from rest_framework import permissions


class IsOwnerOrAdmin(permissions.BasePermission):
    
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser or request.user.is_staff:
            return True
        
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        
        if hasattr(obj, 'alert'):
            return obj.alert.owner == request.user
        
        return False


class IsAdmin(permissions.BasePermission):
    
    def has_permission(self, request, view):
        return request.user and (request.user.is_superuser or request.user.is_staff)