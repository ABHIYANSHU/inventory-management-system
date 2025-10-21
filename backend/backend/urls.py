# URL routing configuration for the project
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# URL patterns - maps URLs to views
urlpatterns = [
    # Django admin interface
    path('admin/', admin.site.urls),
    # JWT authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Get access & refresh tokens
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh access token
    # Include inventory app URLs
    path('api/', include('inventory.urls')),  # All inventory endpoints under /api/
]
