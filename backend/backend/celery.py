# Celery configuration for asynchronous task processing
import os
from celery import Celery
from celery.schedules import crontab

# Set Django settings module for Celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Create Celery app instance with project name
app = Celery('backend')

# Load Celery config from Django settings (settings starting with CELERY_)
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks.py files in all installed Django apps
app.autodiscover_tasks()

# Configure Celery Beat schedule for periodic tasks
app.conf.beat_schedule = {
    'check-low-stock-daily': {
        'task': 'inventory.tasks.check_low_stock',  # Task to execute
        'schedule': crontab(hour=0, minute=0),  # Run daily at midnight
    },
}
