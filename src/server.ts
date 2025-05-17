import app from './app';
import path from 'path';
import fs from 'fs';

const PORT = process.env.PORT || 3000;

// Check if products.json exists, if not, inform the user to run the fetch script
const productsPath = path.join(__dirname, './data/products.json');
if (!fs.existsSync(productsPath)) {
  console.warn(
    'Products data file not found. Please run "npm run fetch-products" to fetch product data before starting the server.'
  );
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation:`);
  console.log(`- GET /products/search?q={query}&limit={limit}&skip={skip}`);
  console.log(`- GET /health (Health check endpoint)`);
});