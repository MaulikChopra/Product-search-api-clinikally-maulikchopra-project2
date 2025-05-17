import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { Product } from '../types/product';

const PRODUCTS_LIMIT = 100;
const API_URL = `https://dummyjson.com/products?limit=${PRODUCTS_LIMIT}`;
const OUTPUT_PATH = path.join(__dirname, '../data/products.json');

async function fetchProducts() {
  try {
    console.log(`Fetching ${PRODUCTS_LIMIT} products from DummyJSON API...`);
    const response = await axios.get(API_URL);
    
    if (!response.data || !response.data.products) {
      throw new Error('Invalid API response format');
    }
    
    const products: Product[] = response.data.products;
    console.log(`Successfully fetched ${products.length} products`);
    
    // Ensure the data directory exists
    const dataDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write products to JSON file
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(products, null, 2));
    console.log(`Products saved to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('Error fetching products:', error);
    process.exit(1);
  }
}

fetchProducts();