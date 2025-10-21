// ProductStock component - displays stock levels for all products and variations
import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import axios from 'axios';

function ProductStock() {
  const [products, setProducts] = useState([]);  // All products with variations
  const [searchTerm, setSearchTerm] = useState('');  // Search filter

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Helper to add JWT token to requests
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });

  // Fetch all products with nested variations
  const fetchProducts = async () => {
    const response = await axios.get('http://localhost:8000/api/products/', getAuthHeader());
    setProducts(response.data);
  };

  // Filter products by name or category based on search term
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Product Stock</Typography>
      {/* Search input to filter products */}
      <TextField 
        fullWidth 
        label="Search Products" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        sx={{ mb: 2 }}
      />
      {/* Display each product with its variations */}
      {filteredProducts.map((product) => (
        <Box key={product.id} sx={{ mb: 3 }}>
          <Typography variant="h6">{product.name} ({product.category})</Typography>
          <TableContainer component={Paper} sx={{ mt: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>SKU Code</TableCell>
                  <TableCell>Attributes</TableCell>
                  <TableCell>Stock Level</TableCell>
                  <TableCell>Reorder Level</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {product.variations?.map((variation) => (
                  <TableRow key={variation.id}>
                    <TableCell>{variation.sku_code}</TableCell>
                    <TableCell>{JSON.stringify(variation.attributes)}</TableCell>
                    <TableCell>{variation.stock_level}</TableCell>
                    <TableCell>{variation.reorder_level}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Container>
  );
}

export default ProductStock;
