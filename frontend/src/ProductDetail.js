// ProductDetail component - displays product info and manages variations/SKUs
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box } from '@mui/material';
import { Add, Edit, Delete, ArrowBack } from '@mui/icons-material';
import axios from 'axios';

function ProductDetail({ productId, onBack }) {
  const [product, setProduct] = useState(null);  // Product details
  const [variations, setVariations] = useState([]);  // List of product variations/SKUs
  const [open, setOpen] = useState(false);  // Dialog state
  const [currentVariation, setCurrentVariation] = useState({ sku_code: '', attributes: '{}', stock_level: 0, reorder_level: 10 });

  // Fetch product and variations when component mounts or productId changes
  useEffect(() => {
    fetchProduct();
    fetchVariations();
  }, [productId]);

  // Helper to add JWT token to requests
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });

  // Fetch product details from API
  const fetchProduct = async () => {
    const response = await axios.get(`http://localhost:8000/api/products/${productId}/`, getAuthHeader());
    setProduct(response.data);
  };

  // Fetch all variations for this product
  const fetchVariations = async () => {
    const response = await axios.get(`http://localhost:8000/api/products/${productId}/variations/`, getAuthHeader());
    setVariations(response.data);
  };

  // Open dialog to add new variation
  const handleOpen = () => {
    setCurrentVariation({ sku_code: '', attributes: '{}', stock_level: 0, reorder_level: 10 });
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Save new variation
  const handleSave = async () => {
    try {
      // Parse attributes string to JSON object
      const data = { ...currentVariation, attributes: JSON.parse(currentVariation.attributes) };
      await axios.post(`http://localhost:8000/api/products/${productId}/variations/`, data, getAuthHeader());
      fetchVariations();  // Refresh list
      handleClose();
    } catch (err) {
      alert('Invalid JSON format for attributes');  // Show error if JSON is malformed
    }
  };

  // Delete a variation
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/api/variations/${id}/`, getAuthHeader());
    fetchVariations();  // Refresh list
  };

  // Wait for product data to load
  if (!product) return null;

  return (
    <Container sx={{ mt: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={onBack}>Back to Products</Button>
      {/* Display product information */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h4">{product.name}</Typography>
        <Typography variant="body1">Category: {product.category}</Typography>
        <Typography variant="body1">Description: {product.description}</Typography>
      </Box>
      {/* Variations/SKUs section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Variations / SKUs</Typography>
        <Button startIcon={<Add />} variant="contained" onClick={handleOpen} sx={{ mt: 2 }}>Add Variation/SKU</Button>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SKU Code</TableCell>
                <TableCell>Attributes</TableCell>
                <TableCell>Stock Level</TableCell>
                <TableCell>Reorder Level</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {variations.map((variation) => (
                <TableRow key={variation.id}>
                  <TableCell>{variation.sku_code}</TableCell>
                  <TableCell>{JSON.stringify(variation.attributes)}</TableCell>
                  <TableCell>{variation.stock_level}</TableCell>
                  <TableCell>{variation.reorder_level}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(variation.id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Variation/SKU</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="SKU Code" value={currentVariation.sku_code} onChange={(e) => setCurrentVariation({ ...currentVariation, sku_code: e.target.value })} />
          <TextField fullWidth margin="dense" label="Attributes (JSON)" placeholder='{"color": "Black", "size": "Medium"}' value={currentVariation.attributes} onChange={(e) => setCurrentVariation({ ...currentVariation, attributes: e.target.value })} />
          <TextField fullWidth margin="dense" label="Stock Level" type="number" value={currentVariation.stock_level} onChange={(e) => setCurrentVariation({ ...currentVariation, stock_level: parseInt(e.target.value) })} />
          <TextField fullWidth margin="dense" label="Reorder Level" type="number" value={currentVariation.reorder_level} onChange={(e) => setCurrentVariation({ ...currentVariation, reorder_level: parseInt(e.target.value) })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ProductDetail;
