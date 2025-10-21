// Admin Dashboard - main interface for managing products, users, and suppliers
import React, { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Add, Edit, Delete, Logout, Group, LocalShipping, Visibility } from '@mui/icons-material';
import axios from 'axios';
import UsersRoles from './UsersRoles';
import Suppliers from './Suppliers';
import ProductDetail from './ProductDetail';

const API_URL = 'http://localhost:8000/api/products/';

function Dashboard({ onLogout }) {
  const [products, setProducts] = useState([]);  // List of all products
  const [open, setOpen] = useState(false);  // Dialog open/close state
  const [editMode, setEditMode] = useState(false);  // Create vs Edit mode
  const [currentProduct, setCurrentProduct] = useState({ id: null, name: '', category: '', description: '', quantity: 0, price: 0 });
  const [showUsersRoles, setShowUsersRoles] = useState(false);  // Toggle Users & Roles view
  const [showSuppliers, setShowSuppliers] = useState(false);  // Toggle Suppliers view
  const [selectedProductId, setSelectedProductId] = useState(null);  // Product detail view

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Helper to add JWT token to API requests
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });

  // Fetch all products from API
  const fetchProducts = async () => {
    const response = await axios.get(API_URL, getAuthHeader());
    setProducts(response.data);
  };

  // Open dialog for creating or editing a product
  const handleOpen = (product = null) => {
    if (product) {
      setCurrentProduct(product);  // Edit existing product
      setEditMode(true);
    } else {
      setCurrentProduct({ id: null, name: '', category: '', description: '', quantity: 0, price: 0 });  // Create new
      setEditMode(false);
    }
    setOpen(true);
  };

  // Close dialog and reset form
  const handleClose = () => {
    setOpen(false);
    setCurrentProduct({ id: null, name: '', category: '', description: '', quantity: 0, price: 0 });
  };

  // Save product (create or update)
  const handleSave = async () => {
    if (editMode) {
      await axios.put(`${API_URL}${currentProduct.id}/`, currentProduct, getAuthHeader());  // Update existing
      fetchProducts();
      handleClose();
    } else {
      const response = await axios.post(API_URL, currentProduct, getAuthHeader());  // Create new
      fetchProducts();
      handleClose();
      setSelectedProductId(response.data.id);  // Navigate to new product detail
    }
  };

  // Delete a product
  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}${id}/`, getAuthHeader());
    fetchProducts();  // Refresh list
  };

  // Show Users & Roles management view
  if (showUsersRoles) {
    return (
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Inventory Management</Typography>
            <Button color="inherit" onClick={() => { setShowUsersRoles(false); setShowSuppliers(false); }}>Products</Button>
            <Button color="inherit" startIcon={<LocalShipping />} onClick={() => { setShowSuppliers(true); setShowUsersRoles(false); }}>Suppliers</Button>
            <Button color="inherit" startIcon={<Logout />} onClick={onLogout}>Logout</Button>
          </Toolbar>
        </AppBar>
        <UsersRoles />
      </>
    );
  }

  // Show Suppliers management view
  if (showSuppliers) {
    return (
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Inventory Management</Typography>
            <Button color="inherit" onClick={() => { setShowUsersRoles(false); setShowSuppliers(false); }}>Products</Button>
            <Button color="inherit" startIcon={<Group />} onClick={() => { setShowUsersRoles(true); setShowSuppliers(false); }}>Users & Roles</Button>
            <Button color="inherit" startIcon={<Logout />} onClick={onLogout}>Logout</Button>
          </Toolbar>
        </AppBar>
        <Suppliers />
      </>
    );
  }

  // Show product detail view with variations
  if (selectedProductId) {
    return <ProductDetail productId={selectedProductId} onBack={() => setSelectedProductId(null)} />;
  }

  // Main products list view
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Inventory Management</Typography>
          <Button color="inherit" startIcon={<Add />} onClick={() => handleOpen()}>Add Product</Button>
          <Button color="inherit" startIcon={<LocalShipping />} onClick={() => setShowSuppliers(true)}>Suppliers</Button>
          <Button color="inherit" startIcon={<Group />} onClick={() => setShowUsersRoles(true)}>Users & Roles</Button>
          <Button color="inherit" startIcon={<Logout />} onClick={onLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => setSelectedProductId(product.id)}><Visibility /></IconButton>
                    <IconButton onClick={() => handleOpen(product)}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(product.id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Name" value={currentProduct.name} onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })} />
          <TextField fullWidth margin="dense" label="Category" value={currentProduct.category} onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })} />
          <TextField fullWidth margin="dense" label="Description" value={currentProduct.description} onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })} />
          <TextField fullWidth margin="dense" label="Quantity" type="number" value={currentProduct.quantity} onChange={(e) => setCurrentProduct({ ...currentProduct, quantity: parseInt(e.target.value) })} />
          <TextField fullWidth margin="dense" label="Price" type="number" value={currentProduct.price} onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Dashboard;
