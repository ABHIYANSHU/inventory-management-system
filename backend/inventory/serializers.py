# Serializers convert models to/from JSON for API responses
from rest_framework import serializers
from .models import Product, ProductVariation, Supplier, PurchaseOrder, PurchaseOrderItem, SalesOrder, SalesOrderItem
from django.contrib.auth.models import Group, Permission, User

# ProductVariation serializer - handles product SKU data
class ProductVariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariation
        fields = '__all__'  # Include all model fields
        read_only_fields = ['product']  # Product field set via nested route

# Product serializer - includes nested variations
class ProductSerializer(serializers.ModelSerializer):
    variations = ProductVariationSerializer(many=True, read_only=True)  # Nested variations list
    
    class Meta:
        model = Product
        fields = '__all__'

# Supplier serializer
class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

# PurchaseOrderItem serializer - includes product details
class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    product_variation_details = ProductVariationSerializer(source='product_variation', read_only=True)  # Nested product info
    
    class Meta:
        model = PurchaseOrderItem
        fields = ['id', 'product_variation', 'product_variation_details', 'quantity_ordered', 'cost_per_unit']

# PurchaseOrder serializer - handles order creation and stock updates
class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True, read_only=True)  # For reading items
    supplier_details = SupplierSerializer(source='supplier', read_only=True)  # Nested supplier info
    items_data = PurchaseOrderItemSerializer(many=True, write_only=True, required=False, source='items')  # For creating items
    
    class Meta:
        model = PurchaseOrder
        fields = ['id', 'supplier', 'supplier_details', 'status', 'items', 'items_data', 'created_at', 'updated_at']
    
    # Create purchase order with line items
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        purchase_order = PurchaseOrder.objects.create(**validated_data)
        for item_data in items_data:
            PurchaseOrderItem.objects.create(purchase_order=purchase_order, **item_data)
        return purchase_order
    
    # Update order - increases stock when status changes to 'Received'
    def update(self, instance, validated_data):
        from django.db.models import F
        old_status = instance.status
        new_status = validated_data.get('status', old_status)
        
        instance.status = new_status
        instance.save()
        
        # Increase stock when order is received
        if old_status != 'Received' and new_status == 'Received':
            for item in instance.items.all():
                ProductVariation.objects.filter(id=item.product_variation.id).update(
                    stock_level=F('stock_level') + item.quantity_ordered  # F() prevents race conditions
                )
        
        return instance

# SalesOrderItem serializer
class SalesOrderItemSerializer(serializers.ModelSerializer):
    product_variation_details = ProductVariationSerializer(source='product_variation', read_only=True)  # Nested product info
    
    class Meta:
        model = SalesOrderItem
        fields = ['id', 'product_variation', 'product_variation_details', 'quantity_sold', 'sale_price_per_unit']

# SalesOrder serializer - validates stock and deducts on fulfillment
class SalesOrderSerializer(serializers.ModelSerializer):
    items = SalesOrderItemSerializer(many=True, read_only=True)  # For reading items
    items_data = SalesOrderItemSerializer(many=True, write_only=True, required=False, source='items')  # For creating items
    
    class Meta:
        model = SalesOrder
        fields = ['id', 'customer_email', 'status', 'items', 'items_data', 'created_at', 'updated_at']
    
    # Create sales order with line items
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        sales_order = SalesOrder.objects.create(**validated_data)
        for item_data in items_data:
            SalesOrderItem.objects.create(sales_order=sales_order, **item_data)
        return sales_order
    
    # Update order - validates stock and deducts when status changes to 'Fulfilled'
    def update(self, instance, validated_data):
        from django.db.models import F
        old_status = instance.status
        new_status = validated_data.get('status', old_status)
        
        if old_status != 'Fulfilled' and new_status == 'Fulfilled':
            # Validate sufficient stock before fulfilling
            for item in instance.items.all():
                variation = ProductVariation.objects.get(id=item.product_variation.id)
                if variation.stock_level < item.quantity_sold:
                    raise serializers.ValidationError(f"Insufficient stock for {variation.sku_code}")
            
            # Deduct stock after validation
            for item in instance.items.all():
                ProductVariation.objects.filter(id=item.product_variation.id).update(
                    stock_level=F('stock_level') - item.quantity_sold
                )
        
        instance.status = new_status
        instance.save()
        return instance

# Permission serializer - for role-based access control
class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename']

# Group serializer - manages user groups/roles
class GroupSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)  # For reading permissions
    permission_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)  # For assigning permissions

    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions', 'permission_ids']

    def create(self, validated_data):
        permission_ids = validated_data.pop('permission_ids', [])
        group = Group.objects.create(**validated_data)
        if permission_ids:
            group.permissions.set(permission_ids)  # Assign permissions to group
        return group

    def update(self, instance, validated_data):
        permission_ids = validated_data.pop('permission_ids', None)
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        if permission_ids is not None:
            instance.permissions.set(permission_ids)  # Update group permissions
        return instance


# User serializer - manages user accounts and group assignments
class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)  # For reading user groups
    group_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)  # For assigning groups
    password = serializers.CharField(write_only=True, required=False)  # Password never returned in responses

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'groups', 'group_ids', 'password']

    def create(self, validated_data):
        group_ids = validated_data.pop('group_ids', [])
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data, password=password)  # Hashes password
        if group_ids:
            user.groups.set(group_ids)  # Assign user to groups
        return user

    def update(self, instance, validated_data):
        group_ids = validated_data.pop('group_ids', None)
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)  # Hash password before saving
        instance.save()
        if group_ids is not None:
            instance.groups.set(group_ids)  # Update user groups
        return instance
