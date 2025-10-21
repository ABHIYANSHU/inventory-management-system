# Django admin configuration for inventory models
from django.contrib import admin
from .models import Product, ProductVariation, Supplier, PurchaseOrder, PurchaseOrderItem, SalesOrder, SalesOrderItem

# Register models with Django admin interface
# This makes them manageable through the admin panel at /admin/
admin.site.register(Product)  # Manage products
admin.site.register(ProductVariation)  # Manage product variations (SKUs)
admin.site.register(Supplier)  # Manage suppliers
admin.site.register(PurchaseOrder)  # Manage purchase orders
admin.site.register(PurchaseOrderItem)  # Manage purchase order line items
admin.site.register(SalesOrder)  # Manage sales orders
admin.site.register(SalesOrderItem)  # Manage sales order line items
