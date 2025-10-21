# URL routing for inventory API endpoints
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, ProductVariationViewSet, SupplierViewSet, PurchaseOrderViewSet, SalesOrderViewSet, GroupViewSet, PermissionViewSet, UserViewSet, current_user

# Router automatically generates URL patterns for ViewSets
router = DefaultRouter()
router.register(r'products', ProductViewSet)  # /api/products/
router.register(r'variations', ProductVariationViewSet)  # /api/variations/
router.register(r'suppliers', SupplierViewSet)  # /api/suppliers/
router.register(r'purchase-orders', PurchaseOrderViewSet)  # /api/purchase-orders/
router.register(r'sales-orders', SalesOrderViewSet)  # /api/sales-orders/
router.register(r'groups', GroupViewSet)  # /api/groups/
router.register(r'permissions', PermissionViewSet)  # /api/permissions/
router.register(r'users', UserViewSet)  # /api/users/

urlpatterns = [
    path('users/me/', current_user, name='current_user'),  # Get current authenticated user
    path('', include(router.urls)),  # Include all router-generated URLs
]
