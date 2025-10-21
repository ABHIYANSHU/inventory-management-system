# ASGI (Asynchronous Server Gateway Interface) configuration for Django
# Used for async features like WebSockets, HTTP/2, and async views
import os
from django.core.asgi import get_asgi_application

# Set the Django settings module for the ASGI application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Create the ASGI application callable
# This is what ASGI servers (like Daphne, Uvicorn) use to run Django
application = get_asgi_application()
