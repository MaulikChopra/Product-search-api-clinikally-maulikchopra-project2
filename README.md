# Product Search API

A RESTful API that provides product search with autocomplete functionality. This API serves as the backend for a product search feature.

## Features

- Search products by title or brand with a minimum query length
- Pagination support with limit and skip parameters
- Optimized search with relevance scoring
- Error handling with appropriate HTTP status codes
- Docker support for easy deployment

## Technology Stack

- Node.js
- Express.js
- TypeScript
- Jest (for testing)
- Docker

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

### Installation

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Fetch product data from dummyjson.com

```bash
npm run fetch-products
```

4. Start the development server

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Docker

```bash
# Build the Docker image
docker build -t product-search-api .

# Run the container
docker run -p 3000:3000 product-search-api
```

## API Documentation

### Search Products

```
GET /products/search?q={query}&limit={limit}&skip={skip}
```

#### Parameters

- `q` (required): Search query (minimum 2 characters)
- `limit` (optional): Number of results to return (default: 10)
- `skip` (optional): Number of results to skip (default: 0)

#### Example Request

```bash
curl -X GET "http://localhost:3000/products/search?q=phone&limit=5&skip=0"
```

#### Example Response

```json
{
  "products": [
    {
      "id": 1,
      "title": "iPhone 9",
      "description": "An apple mobile which is nothing like apple",
      "price": 549,
      "discountPercentage": 12.96,
      "rating": 4.69,
      "stock": 94,
      "brand": "Apple",
      "category": "smartphones",
      "thumbnail": "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
      "images": ["..."]
    },
    // ...more products
  ],
  "total": 10,
  "skip": 0,
  "limit": 5
}
```

### Health Check

```
GET /health
```

#### Example Response

```json
{
  "status": "ok"
}
```

## Testing

Run the test suite with:

```bash
npm test
```

## Design Documentation

### API Structure

This API follows RESTful principles with a clean, modular architecture:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Middleware**: Process requests before they reach the controller
- **Routes**: Define API endpoints and connect them to controllers

### Data Schema

Products are structured with the following properties:

```typescript
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}
```

### Pagination Logic

- Pagination is implemented using `limit` and `skip` parameters
- `limit` defines how many results to return (default: 10)
- `skip` defines how many results to skip (default: 0)
- Total count is returned to allow clients to implement pagination UI

### Search Scoring

Products are scored based on the following criteria (in descending priority):

1. Exact title match (score: 100)
2. Title starts with query (score: 75)
3. Brand exactly matches query (score: 60)
4. Title contains query (score: 50)
5. Brand starts with query (score: 40)
6. Brand contains query (score: 30)

This scoring system ensures that the most relevant results appear first.

### Assumptions and Limitations

- The API uses an in-memory data store, which would be replaced with a database in a production environment
- Search is currently limited to title and brand fields
- No authentication or rate limiting is implemented
- The product data is static and fetched once during server start-up