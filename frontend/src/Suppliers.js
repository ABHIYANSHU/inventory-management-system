// Suppliers component - manages supplier information for purchase orders
import React, { useState, useEffect } from 'react';
import { Container, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/suppliers/';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);  // List of all suppliers
  const [open, setOpen] = useState(false);  // Dialog state
  const [editMode, setEditMode] = useState(false);  // Create vs Edit mode
  const [currentSupplier, setCurrentSupplier] = useState({ id: null, name: '', email: '', phone: '' });

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Helper to add JWT token to requests
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });

  // Fetch all suppliers from API
  const fetchSuppliers = async () => {
    const response = await axios.get(API_URL, getAuthHeader());
    setSuppliers(response.data);
  };

  // Open dialog for creating or editing a supplier
  const handleOpen = (supplier = null) => {
    if (supplier) {
      setCurrentSupplier(supplier);  // Edit existing supplier
      setEditMode(true);
    } else {
      setCurrentSupplier({ id: null, name: '', email: '', phone: '' });  // Create new
      setEditMode(false);
    }
    setOpen(true);
  };

  // Close dialog and reset form
  const handleClose = () => {
    setOpen(false);
    setCurrentSupplier({ id: null, name: '', email: '', phone: '' });
  };

  // Save supplier (create or update)
  const handleSave = async () => {
    if (editMode) {
      await axios.put(`${API_URL}${currentSupplier.id}/`, currentSupplier, getAuthHeader());  // Update existing
    } else {
      await axios.post(API_URL, currentSupplier, getAuthHeader());  // Create new
    }
    fetchSuppliers();  // Refresh list
    handleClose();
  };

  // Delete a supplier
  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}${id}/`, getAuthHeader());
    fetchSuppliers();  // Refresh list
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Button startIcon={<Add />} variant="contained" onClick={() => handleOpen()}>Add New Supplier</Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(supplier)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(supplier.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Name" value={currentSupplier.name} onChange={(e) => setCurrentSupplier({ ...currentSupplier, name: e.target.value })} />
          <TextField fullWidth margin="dense" label="Email" type="email" value={currentSupplier.email} onChange={(e) => setCurrentSupplier({ ...currentSupplier, email: e.target.value })} />
          <TextField fullWidth margin="dense" label="Phone" value={currentSupplier.phone} onChange={(e) => setCurrentSupplier({ ...currentSupplier, phone: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Suppliers;
