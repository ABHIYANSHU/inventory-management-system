// WarehouseDashboard component - interface for warehouse managers
import React, { useState } from 'react';
import { Container, AppBar, Toolbar, Typography, Button, Box, Card, CardContent } from '@mui/material';
import { Logout, Inventory, ShoppingCart } from '@mui/icons-material';
import PurchaseOrders from './PurchaseOrders';

function WarehouseDashboard({ user, onLogout }) {
  const [showPurchaseOrders, setShowPurchaseOrders] = useState(false);  // Toggle purchase orders view

  // Show purchase orders view
  if (showPurchaseOrders) {
    return (
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Warehouse Dashboard</Typography>
            <Button color="inherit" onClick={() => setShowPurchaseOrders(false)}>Dashboard</Button>
            <Typography variant="body1" sx={{ mr: 2 }}>Welcome, {user.username}</Typography>
            <Button color="inherit" startIcon={<Logout />} onClick={onLogout}>Logout</Button>
          </Toolbar>
        </AppBar>
        <PurchaseOrders />
      </>
    );
  }

  // Show main dashboard home view
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Warehouse Dashboard</Typography>
          <Button color="inherit" startIcon={<ShoppingCart />} onClick={() => setShowPurchaseOrders(true)}>Purchase Orders</Button>
          <Typography variant="body1" sx={{ mr: 2 }}>Welcome, {user.username}</Typography>
          <Button color="inherit" startIcon={<Logout />} onClick={onLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Warehouse Manager Portal</Typography>
        {/* Info card explaining warehouse manager role */}
        <Box sx={{ mt: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Inventory sx={{ mr: 1, verticalAlign: 'middle' }} />
                Inbound Stock Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage purchase orders and log incoming stock from suppliers.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
}

export default WarehouseDashboard;
