# Import the Celery app instance from celery.py module
# This ensures Celery is loaded when Django starts
from .celery import app as celery_app

# __all__ defines what gets exported when someone does "from backend import *"
# Making celery_app available ensures it's discovered by Celery workers
__all__ = ('celery_app',)
