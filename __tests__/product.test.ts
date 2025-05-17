import request from 'supertest';
import app from '../src/app';
import fs from 'fs';
import path from 'path';

// Mock the products data for testing
const mockProducts = [
  {
    id: 1,
    title: 'iPhone 9',
    description: 'An apple mobile which is nothing like apple',
    price: 549,
    discountPercentage: 12.96,
    rating: 4.69,
    stock: 94,
    brand: 'Apple',
    category: 'smartphones',
    thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
    images: ['https://cdn.dummyjson.com/product-images/1/1.jpg']
  },
  {
    id: 2,
    title: 'iPhone X',
    description: 'SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology',
    price: 899,
    discountPercentage: 17.94,
    rating: 4.44,
    stock: 34,
    brand: 'Apple',
    category: 'smartphones',
    thumbnail: 'https://cdn.dummyjson.com/product-images/2/thumbnail.jpg',
    images: ['https://cdn.dummyjson.com/product-images/2/1.jpg']
  },
  {
    id: 3,
    title: 'Samsung Universe 9',
    description: 'Samsung\'s new variant which goes beyond Galaxy',
    price: 1249,
    discountPercentage: 15.46,
    rating: 4.09,
    stock: 36,
    brand: 'Samsung',
    category: 'smartphones',
    thumbnail: 'https://cdn.dummyjson.com/product-images/3/thumbnail.jpg',
    images: ['https://cdn.dummyjson.com/product-images/3/1.jpg']
  }
];

// Mock the fs.readFileSync method
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: jest.fn().mockImplementation(() => {
    return JSON.stringify(mockProducts);
  }),
  existsSync: jest.fn().mockReturnValue(true)
}));

describe('Product API', () => {
  describe('GET /products/search', () => {
    it('should return products that match the query', async () => {
      const response = await request(app)
        .get('/products/search?q=iphone&limit=10&skip=0');
      
      expect(response.status).toBe(200);
      expect(response.body.products).toHaveLength(2);
      expect(response.body.products[0].title).toContain('iPhone');
      expect(response.body.total).toBe(2);
    });

    it('should return a 400 error if the query is less than 2 characters', async () => {
      const response = await request(app)
        .get('/products/search?q=i&limit=10&skip=0');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid query length');
    });

    it('should return a 400 error if the query is missing', async () => {
      const response = await request(app)
        .get('/products/search?limit=10&skip=0');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Missing query parameter: q');
    });

    it('should respect limit and skip parameters', async () => {
      const response = await request(app)
        .get('/products/search?q=phone&limit=1&skip=1');
      
      expect(response.status).toBe(200);
      expect(response.body.products).toHaveLength(1);
      expect(response.body.limit).toBe(1);
      expect(response.body.skip).toBe(1);
    });
  });

  describe('GET /health', () => {
    it('should return a 200 status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('Error handling', () => {
    it('should return a 404 for undefined routes', async () => {
      const response = await request(app).get('/non-existent-route');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Not found');
    });
  });
});