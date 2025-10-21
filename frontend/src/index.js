// Entry point for React application
import React from 'react';
import ReactDOM from 'react-dom/client';  // React 18+ rendering API
import App from './App';

// Create root and render App component into the 'root' div in index.html
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
