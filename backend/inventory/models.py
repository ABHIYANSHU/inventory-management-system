# Database models for inventory management system
from django.db import models

# Product model - represents a product in the inventory
class Product(models.Model):
    name = models.CharField(max_length=200)  # Product name
    category = models.CharField(max_length=100, default='General')  # Product category
    description = models.TextField()  # Detailed description
    quantity = models.IntegerField(default=0)  # Total quantity in stock
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Product price
    created_at = models.DateTimeField(auto_now_add=True)  # Auto-set on creation
    updated_at = models.DateTimeField(auto_now=True)  # Auto-update on save

    # String representation for admin and debugging
    def __str__(self):
        return self.name

# ProductVariation model - represents different SKUs of a product
class ProductVariation(models.Model):
    product = models.ForeignKey(Product, related_name='variations', on_delete=models.CASCADE)  # Link to parent product
    sku_code = models.CharField(max_length=100, unique=True)  # Unique SKU identifier
    attributes = models.JSONField()  # Flexible attributes (e.g., {"size": "L", "color": "red"})
    stock_level = models.IntegerField(default=0)  # Current stock quantity
    reorder_level = models.IntegerField(default=10)  # Threshold for low stock alerts
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} - {self.sku_code}"

# Supplier model - represents suppliers for purchase orders
class Supplier(models.Model):
    name = models.CharField(max_length=200)  # Supplier name
    email = models.EmailField()  # Contact email
    phone = models.CharField(max_length=20)  # Contact phone
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# PurchaseOrder model - represents orders placed with suppliers
class PurchaseOrder(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),  # Initial state
        ('Submitted', 'Submitted'),  # Sent to supplier
        ('Received', 'Received'),  # Goods received, stock updated
    ]
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)  # Supplier for this order
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')  # Order status
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"PO-{self.id} - {self.supplier.name}"

# PurchaseOrderItem model - line items in a purchase order
class PurchaseOrderItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, related_name='items', on_delete=models.CASCADE)  # Parent order
    product_variation = models.ForeignKey(ProductVariation, on_delete=models.CASCADE)  # Product SKU being ordered
    quantity_ordered = models.IntegerField()  # Quantity to purchase
    cost_per_unit = models.DecimalField(max_digits=10, decimal_places=2)  # Unit cost from supplier

    def __str__(self):
        return f"{self.product_variation.sku_code} - {self.quantity_ordered} units"

# SalesOrder model - represents customer orders
class SalesOrder(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),  # Order placed, awaiting fulfillment
        ('Fulfilled', 'Fulfilled'),  # Order completed, stock deducted
    ]
    customer_email = models.EmailField()  # Customer contact
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')  # Order status
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"SO-{self.id} - {self.customer_email}"

# SalesOrderItem model - line items in a sales order
class SalesOrderItem(models.Model):
    sales_order = models.ForeignKey(SalesOrder, related_name='items', on_delete=models.CASCADE)  # Parent order
    product_variation = models.ForeignKey(ProductVariation, on_delete=models.CASCADE)  # Product SKU being sold
    quantity_sold = models.IntegerField()  # Quantity sold
    sale_price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)  # Unit sale price

    def __str__(self):
        return f"{self.product_variation.sku_code} - {self.quantity_sold} units"
