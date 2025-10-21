# Inventory Management System - Backend

Django REST API with JWT authentication, role-based access control, and automated stock alerts.

## Tech Stack

- Django 4.2
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Celery + Redis (Background Tasks)

## Features

- JWT-based authentication
- Role-based access (Admin, Warehouse Manager, Sales Rep)
- Product & variation management
- Supplier management
- Purchase orders (inbound stock)
- Sales orders (outbound stock)
- Automated low stock alerts via email
- Atomic stock level updates

## API Endpoints

### Authentication
- `POST /api/token/` - Obtain JWT token
- `POST /api/token/refresh/` - Refresh JWT token
- `GET /api/users/me/` - Get current user details

### Products
- `GET /api/products/` - List products
- `POST /api/products/` - Create product
- `GET /api/products/{id}/` - Get product details
- `PUT /api/products/{id}/` - Update product
- `DELETE /api/products/{id}/` - Delete product
- `GET /api/products/{id}/variations/` - List product variations
- `POST /api/products/{id}/variations/` - Create variation

### Variations
- `GET /api/variations/` - List all variations
- `GET /api/variations/{id}/` - Get variation details
- `DELETE /api/variations/{id}/` - Delete variation

### Suppliers
- `GET /api/suppliers/` - List suppliers
- `POST /api/suppliers/` - Create supplier
- `PUT /api/suppliers/{id}/` - Update supplier
- `DELETE /api/suppliers/{id}/` - Delete supplier

### Purchase Orders
- `GET /api/purchase-orders/` - List purchase orders
- `POST /api/purchase-orders/` - Create purchase order
- `GET /api/purchase-orders/{id}/` - Get PO details
- `PATCH /api/purchase-orders/{id}/` - Update PO status (auto-updates stock on "Received")

### Sales Orders
- `GET /api/sales-orders/` - List sales orders
- `POST /api/sales-orders/` - Create sales order
- `GET /api/sales-orders/{id}/` - Get SO details
- `PATCH /api/sales-orders/{id}/` - Update SO status (validates & deducts stock on "Fulfilled")

### Users & Roles (Admin only)
- `GET /api/users/` - List users
- `POST /api/users/` - Create user
- `PATCH /api/users/{id}/` - Update user
- `GET /api/groups/` - List groups
- `POST /api/groups/` - Create group
- `GET /api/permissions/` - List permissions

## Models

### Product
- name, category, description, quantity, price

### ProductVariation
- product (FK), sku_code, attributes (JSON), stock_level, reorder_level

### Supplier
- name, email, phone

### PurchaseOrder
- supplier (FK), status (Draft/Submitted/Received)

### PurchaseOrderItem
- purchase_order (FK), product_variation (FK), quantity_ordered, cost_per_unit

### SalesOrder
- customer_email, status (Pending/Fulfilled)

### SalesOrderItem
- sales_order (FK), product_variation (FK), quantity_sold, sale_price_per_unit

## Background Tasks

### check_low_stock
Runs daily at midnight (00:00 UTC). Checks for items where `stock_level <= reorder_level` and emails Warehouse Managers.

## Setup

### Environment Variables
```
POSTGRES_DB=inventory_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

### Default Admin User
- Username: `admin`
- Email: `admin@example.com`
- Password: `admin123`

## Running Locally

```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver

# Run Celery worker
celery -A backend worker -l info

# Run Celery beat
celery -A backend beat -l info
```

## Docker

See root `docker-compose.yml` for full setup.

## Email Configuration

Development uses console backend (emails print to logs).

For production SMTP:
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-password'
```
