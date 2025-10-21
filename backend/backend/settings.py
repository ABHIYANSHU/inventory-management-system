# Django settings for the inventory management system
from pathlib import Path

# Build paths inside the project (e.g., BASE_DIR / 'subdir')
BASE_DIR = Path(__file__).resolve().parent.parent

# Secret key for cryptographic signing - MUST be kept secret in production
SECRET_KEY = 'django-insecure-change-this-in-production'

# Debug mode - shows detailed error pages. Set to False in production
DEBUG = True

# Hosts allowed to serve the application
ALLOWED_HOSTS = ['*']  # ['*'] allows all hosts - restrict in production

# Applications enabled in this Django project
INSTALLED_APPS = [
    # Django built-in apps
    'django.contrib.admin',  # Admin interface
    'django.contrib.auth',  # Authentication system
    'django.contrib.contenttypes',  # Content type framework
    'django.contrib.sessions',  # Session framework
    'django.contrib.messages',  # Messaging framework
    'django.contrib.staticfiles',  # Static file management
    # Third-party apps
    'rest_framework',  # Django REST Framework for API
    'rest_framework_simplejwt',  # JWT authentication
    'corsheaders',  # CORS headers for frontend communication
    # Custom apps
    'inventory',  # Inventory management app
]

# Middleware - processes requests/responses in order
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',  # Security enhancements
    'django.contrib.sessions.middleware.SessionMiddleware',  # Session management
    'corsheaders.middleware.CorsMiddleware',  # CORS handling (must be before CommonMiddleware)
    'django.middleware.common.CommonMiddleware',  # Common utilities
    'django.middleware.csrf.CsrfViewMiddleware',  # CSRF protection
    'django.contrib.auth.middleware.AuthenticationMiddleware',  # User authentication
    'django.contrib.messages.middleware.MessageMiddleware',  # Message framework
    'django.middleware.clickjacking.XFrameOptionsMiddleware',  # Clickjacking protection
]

# Root URL configuration module
ROOT_URLCONF = 'backend.urls'

# Template engine configuration
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI application for production deployment
WSGI_APPLICATION = 'backend.wsgi.application'

# Database configuration - PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',  # Database engine
        'NAME': 'inventory_db',  # Database name
        'USER': 'postgres',  # Database user
        'PASSWORD': 'postgres',  # Database password
        'HOST': 'db',  # Database host (Docker service name)
        'PORT': '5432',  # PostgreSQL default port
    }
}

# Password validation rules
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},  # Password can't be similar to user info
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},  # Minimum length requirement
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},  # Prevent common passwords
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},  # Password can't be entirely numeric
]

# Internationalization settings
LANGUAGE_CODE = 'en-us'  # Default language
TIME_ZONE = 'UTC'  # Timezone for datetime storage
USE_I18N = True  # Enable internationalization
USE_TZ = True  # Enable timezone support

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS settings - allows frontend to communicate with backend
CORS_ALLOW_ALL_ORIGINS = True  # Allow all origins - restrict in production

# Django REST Framework configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',  # Use JWT tokens for auth
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',  # Require authentication by default
    ],
}

# Celery configuration for async task processing
CELERY_BROKER_URL = 'redis://redis:6379/0'  # Redis as message broker
CELERY_RESULT_BACKEND = 'redis://redis:6379/0'  # Redis for storing task results
CELERY_ACCEPT_CONTENT = ['json']  # Accept only JSON content
CELERY_TASK_SERIALIZER = 'json'  # Serialize tasks as JSON
CELERY_RESULT_SERIALIZER = 'json'  # Serialize results as JSON
CELERY_TIMEZONE = 'UTC'  # Timezone for scheduled tasks

# Email backend - prints emails to console (for development)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
