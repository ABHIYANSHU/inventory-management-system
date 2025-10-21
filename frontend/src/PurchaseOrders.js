// PurchaseOrders component - manages purchase orders from suppliers
import React, { useState, useEffect } from 'react';
import { Container, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Select, MenuItem, FormControl, InputLabel, Box, Typography, Autocomplete } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import axios from 'axios';

function PurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);  // List of all purchase orders
  const [suppliers, setSuppliers] = useState([]);  // Available suppliers
  const [variations, setVariations] = useState([]);  // Available product variations/SKUs
  const [open, setOpen] = useState(false);  // Dialog state
  const [selectedPO, setSelectedPO] = useState(null);  // Selected PO for detail view
  const [currentPO, setCurrentPO] = useState({ supplier: '', status: 'Draft', items: [] });  // New PO being created

  // Fetch all data on component mount
  useEffect(() => {
    fetchPurchaseOrders();
    fetchSuppliers();
    fetchVariations();
  }, []);

  // Helper to add JWT token to requests
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });

  // Fetch all purchase orders
  const fetchPurchaseOrders = async () => {
    const response = await axios.get('http://localhost:8000/api/purchase-orders/', getAuthHeader());
    setPurchaseOrders(response.data);
  };

  // Fetch all suppliers
  const fetchSuppliers = async () => {
    const response = await axios.get('http://localhost:8000/api/suppliers/', getAuthHeader());
    setSuppliers(response.data);
  };

  // Fetch all product variations for order items
  const fetchVariations = async () => {
    const response = await axios.get('http://localhost:8000/api/variations/', getAuthHeader());
    setVariations(response.data);
  };

  // Open dialog to create new PO
  const handleOpen = () => {
    setCurrentPO({ supplier: '', status: 'Draft', items: [] });
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Add new line item to PO
  const handleAddItem = () => {
    setCurrentPO({ ...currentPO, items: [...currentPO.items, { product_variation: '', quantity_ordered: 0, cost_per_unit: 0 }] });
  };

  // Remove line item from PO
  const handleRemoveItem = (index) => {
    const newItems = currentPO.items.filter((_, i) => i !== index);
    setCurrentPO({ ...currentPO, items: newItems });
  };

  // Update line item field
  const handleItemChange = (index, field, value) => {
    const newItems = [...currentPO.items];
    newItems[index][field] = value;
    setCurrentPO({ ...currentPO, items: newItems });
  };

  // Save new purchase order
  const handleSave = async () => {
    const payload = { ...currentPO, items_data: currentPO.items };  // items_data for creating nested items
    await axios.post('http://localhost:8000/api/purchase-orders/', payload, getAuthHeader());
    fetchPurchaseOrders();  // Refresh list
    handleClose();
  };

  // Update PO status (Draft -> Submitted -> Received)
  // When status changes to 'Received', backend automatically increases stock
  const handleUpdateStatus = async (poId, newStatus) => {
    await axios.patch(`http://localhost:8000/api/purchase-orders/${poId}/`, { status: newStatus }, getAuthHeader());
    fetchPurchaseOrders();  // Refresh list
    if (selectedPO?.id === poId) {
      const response = await axios.get(`http://localhost:8000/api/purchase-orders/${poId}/`, getAuthHeader());
      setSelectedPO(response.data);  // Refresh detail view
    }
  };

  // Show PO detail view
  if (selectedPO) {
    return (
      <Container sx={{ mt: 4 }}>
        <Button onClick={() => setSelectedPO(null)}>Back to List</Button>
        <Typography variant="h5" sx={{ mt: 2 }}>Purchase Order PO-{selectedPO.id}</Typography>
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography>Supplier: {selectedPO.supplier_details?.name}</Typography>
          <Typography>Status: {selectedPO.status}</Typography>
          <Typography>Created: {new Date(selectedPO.created_at).toLocaleDateString()}</Typography>
          {/* Status transition buttons */}
          <Box sx={{ mt: 2 }}>
            {selectedPO.status === 'Draft' && (
              <Button variant="contained" onClick={() => handleUpdateStatus(selectedPO.id, 'Submitted')} sx={{ mr: 1 }}>Mark as Sent</Button>
            )}
            {selectedPO.status === 'Submitted' && (
              <Button variant="contained" onClick={() => handleUpdateStatus(selectedPO.id, 'Received')}>Mark as Received</Button>
            )}
          </Box>
          <Typography variant="h6" sx={{ mt: 3 }}>Items</Typography>
          <TableContainer component={Paper} sx={{ mt: 1 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SKU</TableCell>
                  <TableCell>Quantity Ordered</TableCell>
                  <TableCell>Cost Per Unit</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedPO.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product_variation_details?.sku_code}</TableCell>
                    <TableCell>{item.quantity_ordered}</TableCell>
                    <TableCell>${item.cost_per_unit}</TableCell>
                    <TableCell>${(item.quantity_ordered * item.cost_per_unit).toFixed(2)}</TableCell>
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
      <Typography variant="h5" gutterBottom>Purchase Orders</Typography>
      <Button startIcon={<Add />} variant="contained" onClick={handleOpen}>Create New PO</Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>PO ID</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseOrders.map((po) => (
              <TableRow key={po.id} onClick={() => setSelectedPO(po)} sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                <TableCell>PO-{po.id}</TableCell>
                <TableCell>{po.supplier_details?.name}</TableCell>
                <TableCell>{po.status}</TableCell>
                <TableCell>{po.items.length}</TableCell>
                <TableCell>{new Date(po.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Purchase Order</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Supplier</InputLabel>
            <Select value={currentPO.supplier} onChange={(e) => setCurrentPO({ ...currentPO, supplier: e.target.value })}>
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>{supplier.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Items</Typography>
            <Button startIcon={<Add />} onClick={handleAddItem} sx={{ mb: 2 }}>Add Item</Button>
            {currentPO.items.map((item, index) => {
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
                  <TextField fullWidth margin="dense" label="Quantity Ordered" type="number" value={item.quantity_ordered} onChange={(e) => handleItemChange(index, 'quantity_ordered', parseInt(e.target.value))} />
                  <TextField fullWidth margin="dense" label="Cost Per Unit" type="number" value={item.cost_per_unit} onChange={(e) => handleItemChange(index, 'cost_per_unit', parseFloat(e.target.value))} />
                  <IconButton onClick={() => handleRemoveItem(index)}><Delete /></IconButton>
                </Box>
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save as Draft</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default PurchaseOrders;
