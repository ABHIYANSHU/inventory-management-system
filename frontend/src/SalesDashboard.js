// SalesDashboard component - interface for sales representatives
import React, { useState } from 'react';
import { Container, AppBar, Toolbar, Typography, Button, Box, Card, CardContent } from '@mui/material';
import { Logout, ShoppingCart, Inventory, Receipt } from '@mui/icons-material';
import ProductStock from './ProductStock';
import SalesOrders from './SalesOrders';

function SalesDashboard({ user, onLogout }) {
  const [showProducts, setShowProducts] = useState(false);  // Toggle product stock view
  const [showSalesOrders, setShowSalesOrders] = useState(false);  // Toggle sales orders view

  // Show product stock view
  if (showProducts) {
    return (
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Sales Dashboard</Typography>
            <Button color="inherit" onClick={() => { setShowProducts(false); setShowSalesOrders(false); }}>Dashboard</Button>
            <Button color="inherit" startIcon={<Receipt />} onClick={() => { setShowSalesOrders(true); setShowProducts(false); }}>Sales Orders</Button>
            <Typography variant="body1" sx={{ mr: 2 }}>Welcome, {user.username}</Typography>
            <Button color="inherit" startIcon={<Logout />} onClick={onLogout}>Logout</Button>
          </Toolbar>
        </AppBar>
        <ProductStock />
      </>
    );
  }

  // Show sales orders view
  if (showSalesOrders) {
    return (
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Sales Dashboard</Typography>
            <Button color="inherit" onClick={() => { setShowProducts(false); setShowSalesOrders(false); }}>Dashboard</Button>
            <Button color="inherit" startIcon={<Inventory />} onClick={() => { setShowProducts(true); setShowSalesOrders(false); }}>Products</Button>
            <Typography variant="body1" sx={{ mr: 2 }}>Welcome, {user.username}</Typography>
            <Button color="inherit" startIcon={<Logout />} onClick={onLogout}>Logout</Button>
          </Toolbar>
        </AppBar>
        <SalesOrders />
      </>
    );
  }

  // Show main dashboard home view
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Sales Dashboard</Typography>
          <Button color="inherit" startIcon={<Inventory />} onClick={() => setShowProducts(true)}>Products</Button>
          <Button color="inherit" startIcon={<Receipt />} onClick={() => setShowSalesOrders(true)}>Sales Orders</Button>
          <Typography variant="body1" sx={{ mr: 2 }}>Welcome, {user.username}</Typography>
          <Button color="inherit" startIcon={<Logout />} onClick={onLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Sales Rep Portal</Typography>
        <Box sx={{ mt: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <ShoppingCart sx={{ mr: 1, verticalAlign: 'middle' }} />
                Outbound Stock Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create customer orders and fulfill them from existing stock.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
}

export default SalesDashboard;
