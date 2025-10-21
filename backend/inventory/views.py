# API views for inventory management
from rest_framework import viewsets, status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import Product, ProductVariation, Supplier, PurchaseOrder, PurchaseOrderItem, SalesOrder, SalesOrderItem
from .serializers import ProductSerializer, ProductVariationSerializer, SupplierSerializer, PurchaseOrderSerializer, SalesOrderSerializer, GroupSerializer, PermissionSerializer, UserSerializer
from django.contrib.auth.models import Group, Permission, User

# ProductViewSet - provides CRUD operations for products
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()  # All products
    serializer_class = ProductSerializer

    # Custom action: /api/products/{id}/variations/
    @action(detail=True, methods=['get', 'post'], url_path='variations')
    def variations(self, request, pk=None):
        product = self.get_object()
        if request.method == 'GET':
            # List all variations for this product
            variations = product.variations.all()
            serializer = ProductVariationSerializer(variations, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            # Create new variation for this product
            serializer = ProductVariationSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(product=product)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ProductVariationViewSet - CRUD for product variations/SKUs
class ProductVariationViewSet(viewsets.ModelViewSet):
    queryset = ProductVariation.objects.all()
    serializer_class = ProductVariationSerializer

# SupplierViewSet - CRUD for suppliers
class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

# PurchaseOrderViewSet - CRUD for purchase orders
class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer

# SalesOrderViewSet - CRUD for sales orders
class SalesOrderViewSet(viewsets.ModelViewSet):
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer

# GroupViewSet - CRUD for user groups/roles (admin only)
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAdminUser]  # Only admins can manage groups

# PermissionViewSet - read-only access to permissions (admin only)
class PermissionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [IsAdminUser]  # Only admins can view permissions

# UserViewSet - CRUD for users (admin only)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]  # Only admins can manage users

# Function view to get current authenticated user's details
@api_view(['GET'])  # Only accepts GET requests
@permission_classes([IsAuthenticated])  # Requires authentication
def current_user(request):
    serializer = UserSerializer(request.user)  # Serialize the logged-in user
    return Response(serializer.data)
