# Django app configuration for the inventory application
from django.apps import AppConfig

class InventoryConfig(AppConfig):
    # Default primary key field type for models
    default_auto_field = 'django.db.models.BigAutoField'
    # App name - must match the app directory name
    name = 'inventory'
