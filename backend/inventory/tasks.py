# Celery tasks for background processing
from celery import shared_task
from django.db.models import F
from django.core.mail import send_mail
from django.contrib.auth.models import Group
from .models import ProductVariation

# Scheduled task to check for low stock items and alert warehouse managers
@shared_task  # Makes this function a Celery task
def check_low_stock():
    # Find items where stock_level <= reorder_level
    low_stock_items = ProductVariation.objects.filter(stock_level__lte=F('reorder_level'))
    
    if low_stock_items.exists():
        # Get Warehouse Manager group
        warehouse_group = Group.objects.filter(name='Warehouse Manager').first()
        if warehouse_group:
            # Get all managers with valid email addresses
            managers = warehouse_group.user_set.filter(email__isnull=False).exclude(email='')
            
            # Send alert for each low stock item
            for item in low_stock_items:
                message = f"LOW STOCK ALERT: '{item.sku_code}' is at {item.stock_level} units (Reorder level is {item.reorder_level})."
                
                # Email each warehouse manager
                for manager in managers:
                    send_mail(
                        subject=f'Low Stock Alert: {item.sku_code}',
                        message=message,
                        from_email='noreply@inventory.com',
                        recipient_list=[manager.email],
                        fail_silently=True,  # Don't raise exceptions on email errors
                    )
                
                print(f"Alert sent: {message}")
    
    return f"Checked {ProductVariation.objects.count()} items, {low_stock_items.count()} low stock"
