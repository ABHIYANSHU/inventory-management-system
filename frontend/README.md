# Inventory Management System - Frontend

React application with Material-UI for managing inventory, purchase orders, and sales orders with role-based dashboards.

## Tech Stack

- React 18
- Material-UI (MUI) 5
- Axios
- JWT Authentication

## Features

- JWT-based authentication with token storage
- Role-based dashboard routing
- Admin Dashboard (full access)
- Warehouse Manager Dashboard (inbound stock)
- Sales Rep Dashboard (outbound stock)
- Product & variation management
- Supplier management
- Purchase order workflow
- Sales order workflow with stock validation
- Real-time stock level display

## User Roles & Access

### Admin (is_staff=True)
- Full access to all features
- Product management (CRUD + variations)
- Supplier management
- User & role management
- Group & permission management

### Warehouse Manager
- Purchase order management
- Create PO, add items, mark as sent/received
- Auto-updates stock on PO receipt

### Sales Rep
- View product stock levels
- Sales order management
- Create SO, add items, mark as fulfilled
- Stock validation on fulfillment

## Components

### Authentication
- **Login** - JWT authentication, redirects based on role
- **App** - Main router, fetches user role from `/api/users/me/`

### Admin Dashboard
- **Dashboard** - Main admin interface
- **ProductDetail** - Manage product variations/SKUs
- **Suppliers** - CRUD supplier management
- **UsersRoles** - User and group management

### Warehouse Dashboard
- **WarehouseDashboard** - Warehouse manager interface
- **PurchaseOrders** - Create and manage purchase orders
  - Select supplier
  - Add items with SKU search
  - Mark as Sent → Received (auto-updates stock)

### Sales Dashboard
- **SalesDashboard** - Sales rep interface
- **ProductStock** - View products and stock levels
- **SalesOrders** - Create and manage sales orders
  - Enter customer email
  - Add items with SKU search (shows current stock)
  - Mark as Fulfilled (validates & deducts stock)

## Key Features

### JWT Token Management
- Tokens stored in localStorage
- Automatic token inclusion in API requests
- Logout clears tokens

### Role-Based Routing
```javascript
if (isAdmin) → Dashboard
else if (isWarehouseManager) → WarehouseDashboard
else if (isSalesRep) → SalesDashboard
```

### Stock Validation
- Sales orders validate stock before fulfillment
- Displays error if insufficient stock
- Atomic stock updates on backend

### Product Variations
- JSON attributes (e.g., `{"color": "Black", "size": "Medium"}`)
- SKU-based inventory tracking
- Stock level and reorder level per variation

## API Integration

Base URL: `http://localhost:8000/api/`

### Authentication
- `POST /token/` - Login
- `GET /users/me/` - Get current user

### Products
- `GET /products/` - List products
- `POST /products/` - Create product
- `GET /products/{id}/variations/` - Get variations
- `POST /products/{id}/variations/` - Create variation

### Purchase Orders
- `GET /purchase-orders/` - List POs
- `POST /purchase-orders/` - Create PO
- `PATCH /purchase-orders/{id}/` - Update status

### Sales Orders
- `GET /sales-orders/` - List SOs
- `POST /sales-orders/` - Create SO
- `PATCH /sales-orders/{id}/` - Update status

## Setup

### Install Dependencies
```bash
npm install
```

### Environment
Backend API: `http://localhost:8000`

### Run Development Server
```bash
npm start
```

Access at: `http://localhost:3000`

## Docker

See root `docker-compose.yml` for full setup.

## Default Login

**Admin:**
- Username: `admin`
- Password: `admin123`

**Create additional users via Admin Dashboard → Users & Roles**

## Workflows

### 1. Admin Setup
1. Login as admin
2. Create products with variations
3. Create suppliers
4. Create groups (Warehouse Manager, Sales Rep)
5. Create users and assign to groups

### 2. Warehouse Manager - Inbound Stock
1. Login as warehouse manager
2. Navigate to Purchase Orders
3. Create New PO → Select supplier
4. Add items (SKU, quantity, cost)
5. Save as Draft → Mark as Sent → Mark as Received
6. Stock automatically increases

### 3. Sales Rep - Outbound Stock
1. Login as sales rep
2. Check Products for stock availability
3. Navigate to Sales Orders
4. Create New SO → Enter customer email
5. Add items (SKU, quantity, price)
6. Save → Mark as Fulfilled
7. Stock automatically decreases (with validation)

## Error Handling

- Insufficient stock: Displays error message
- Invalid credentials: Shows error on login
- Network errors: Caught and displayed to user

## Future Enhancements

- Real-time notifications
- Advanced search and filtering
- Reports and analytics
- Barcode scanning
- Multi-warehouse support
