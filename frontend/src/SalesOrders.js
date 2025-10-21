// SalesOrders component - manages customer sales orders
import React, { useState, useEffect } from 'react';
import { Container, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Typography, Autocomplete } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import axios from 'axios';

function SalesOrders() {
  const [salesOrders, setSalesOrders] = useState([]);  // List of all sales orders
  const [variations, setVariations] = useState([]);  // Available product variations/SKUs
  const [open, setOpen] = useState(false);  // Dialog state
  const [selectedSO, setSelectedSO] = useState(null);  // Selected SO for detail view
  const [error, setError] = useState('');  // Error message (e.g., insufficient stock)
  const [currentSO, setCurrentSO] = useState({ customer_email: '', status: 'Pending', items: [] });  // New SO being created

  // Fetch data on component mount
  useEffect(() => {
    fetchSalesOrders();
    fetchVariations();
  }, []);

  // Helper to add JWT token to requests
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });

  // Fetch all sales orders
  const fetchSalesOrders = async () => {
    const response = await axios.get('http://localhost:8000/api/sales-orders/', getAuthHeader());
    setSalesOrders(response.data);
  };

  // Fetch all product variations for order items
  const fetchVariations = async () => {
    const response = await axios.get('http://localhost:8000/api/variations/', getAuthHeader());
    setVariations(response.data);
  };

  // Open dialog to create new SO
  const handleOpen = () => {
    setCurrentSO({ customer_email: '', status: 'Pending', items: [] });
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Add new line item to SO
  const handleAddItem = () => {
    setCurrentSO({ ...currentSO, items: [...currentSO.items, { product_variation: '', quantity_sold: 0, sale_price_per_unit: 0 }] });
  };

  // Remove line item from SO
  const handleRemoveItem = (index) => {
    const newItems = currentSO.items.filter((_, i) => i !== index);
    setCurrentSO({ ...currentSO, items: newItems });
  };

  // Update line item field
  const handleItemChange = (index, field, value) => {
    const newItems = [...currentSO.items];
    newItems[index][field] = value;
    setCurrentSO({ ...currentSO, items: newItems });
  };

  // Save new sales order
  const handleSave = async () => {
    const payload = { ...currentSO, items_data: currentSO.items };  // items_data for creating nested items
    await axios.post('http://localhost:8000/api/sales-orders/', payload, getAuthHeader());
    fetchSalesOrders();  // Refresh list
    handleClose();
  };

  // Update SO status (Pending -> Fulfilled)
  // When status changes to 'Fulfilled', backend validates stock and deducts quantity
  const handleUpdateStatus = async (soId, newStatus) => {
    try {
      setError('');
      await axios.patch(`http://localhost:8000/api/sales-orders/${soId}/`, { status: newStatus }, getAuthHeader());
      fetchSalesOrders();  // Refresh list
      if (selectedSO?.id === soId) {
        const response = await axios.get(`http://localhost:8000/api/sales-orders/${soId}/`, getAuthHeader());
        setSelectedSO(response.data);  // Refresh detail view
      }
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || 'Error updating order');  // Show insufficient stock error
    }
  };

  // Show SO detail view
  if (selectedSO) {
    return (
      <Container sx={{ mt: 4 }}>
        <Button onClick={() => { setSelectedSO(null); setError(''); }}>Back to List</Button>
        <Typography variant="h5" sx={{ mt: 2 }}>Sales Order SO-{selectedSO.id}</Typography>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}  {/* Show error if stock insufficient */}
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography>Customer Email: {selectedSO.customer_email}</Typography>
          <Typography>Status: {selectedSO.status}</Typography>
          <Typography>Created: {new Date(selectedSO.created_at).toLocaleDateString()}</Typography>
          {/* Fulfill button - deducts stock when clicked */}
          <Box sx={{ mt: 2 }}>
            {selectedSO.status === 'Pending' && (
              <Button variant="contained" onClick={() => handleUpdateStatus(selectedSO.id, 'Fulfilled')}>Mark as Fulfilled</Button>
            )}
          </Box>
          <Typography variant="h6" sx={{ mt: 3 }}>Items</Typography>
          <TableContainer component={Paper} sx={{ mt: 1 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SKU</TableCell>
                  <TableCell>Quantity Sold</TableCell>
                  <TableCell>Sale Price Per Unit</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedSO.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product_variation_details?.sku_code}</TableCell>
                    <TableCell>{item.quantity_sold}</TableCell>
                    <TableCell>${item.sale_price_per_unit}</TableCell>
                    <TableCell>${(item.quantity_sold * item.sale_price_per_unit).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Sales Orders</Typography>
      <Button startIcon={<Add />} variant="contained" onClick={handleOpen}>Create New SO</Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SO ID</TableCell>
              <TableCell>Customer Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesOrders.map((so) => (
              <TableRow key={so.id} onClick={() => setSelectedSO(so)} sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                <TableCell>SO-{so.id}</TableCell>
                <TableCell>{so.customer_email}</TableCell>
                <TableCell>{so.status}</TableCell>
                <TableCell>{so.items.length}</TableCell>
                <TableCell>{new Date(so.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Sales Order</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Customer Email" type="email" value={currentSO.customer_email} onChange={(e) => setCurrentSO({ ...currentSO, customer_email: e.target.value })} />
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Items</Typography>
            <Button startIcon={<Add />} onClick={handleAddItem} sx={{ mb: 2 }}>Add Item</Button>
            {currentSO.items.map((item, index) => {
              const selectedVariation = variations.find(v => v.id === item.product_variation);
              return (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                  <Autocomplete
                    options={variations}
                    getOptionLabel={(option) => `${option.sku_code} (Stock: ${option.stock_level})`}
                    value={selectedVariation || null}
                    onChange={(e, newValue) => handleItemChange(index, 'product_variation', newValue?.id || '')}
                    renderInput={(params) => <TextField {...params} label="SKU" margin="dense" />}
                  />
                  <TextField fullWidth margin="dense" label="Quantity Sold" type="number" value={item.quantity_sold} onChange={(e) => handleItemChange(index, 'quantity_sold', parseInt(e.target.value))} />
                  <TextField fullWidth margin="dense" label="Sale Price Per Unit" type="number" value={item.sale_price_per_unit} onChange={(e) => handleItemChange(index, 'sale_price_per_unit', parseFloat(e.target.value))} />
                  <IconButton onClick={() => handleRemoveItem(index)}><Delete /></IconButton>
                </Box>
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default SalesOrders;
