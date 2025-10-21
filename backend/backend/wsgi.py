# WSGI (Web Server Gateway Interface) configuration for Django
# Used for traditional synchronous deployment with servers like Gunicorn, uWSGI
import os
from django.core.wsgi import get_wsgi_application

# Set the Django settings module for the WSGI application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Create the WSGI application callable
# This is what WSGI servers use to run Django in production
application = get_wsgi_application()
