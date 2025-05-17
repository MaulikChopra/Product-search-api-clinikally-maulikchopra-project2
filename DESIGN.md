# Product Search API - Design Document

## API Structure and Endpoints

The API follows a RESTful architecture with a single primary endpoint:

- `GET /products/search?q={query}&limit={limit}&skip={skip}`

This endpoint handles the search functionality with the following query parameters:
- `q`: The search query string (required, minimum 2 characters)
- `limit`: Maximum number of results to return (optional, default: 10)
- `skip`: Number of results to skip for pagination (optional, default: 0)

Additionally, a health check endpoint is provided:
- `GET /health`

## Data Schema

The product data schema follows the structure provided by the dummyjson.com API:

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

The search response follows this structure:

```typescript
interface SearchResult {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
```

## Pagination Logic

Pagination is implemented using the standard `limit` and `skip` pattern:

- `limit`: Controls how many items are returned in a single request
- `skip`: Determines how many items to skip before starting to return results

This approach allows for straightforward implementation of pagination on the client side.

### Edge Case Handling:

1. **Invalid limit/skip values**: 
   - If `limit` is not a positive number, return a 400 error
   - If `skip` is negative, return a 400 error
   - Default values are used if parameters are missing (limit=10, skip=0)

2. **Empty result sets**:
   - Returns an empty array with total=0 rather than an error

3. **Skip beyond available results**:
   - Returns an empty array with correct total count

## Search and Ranking Logic

The search implementation uses a scoring system to rank results by relevance:

1. **Scoring Criteria**:
   - Exact title match: 100 points
   - Title starts with query: 75 points
   - Title contains query: 50 points
   - Brand exact match: 60 points
   - Brand starts with query: 40 points
   - Brand contains query: 30 points

2. **Search Process**:
   - Convert query and searchable fields to lowercase for case-insensitive matching
   - Calculate score for each product based on above criteria
   - Filter out products with zero score (no match)
   - Sort products by score in descending order
   - Apply pagination (skip/limit)
   - Return paginated results with metadata

This scoring system prioritizes title matches over brand matches, and exact/prefix matches over substring matches.

## Assumptions and Limitations

1. **Data Source**:
   - Data is stored in-memory after being fetched from the dummyjson.com API
   - In a production environment, this would be replaced with a database

2. **Search Fields**:
   - Currently limited to title and brand fields
   - Could be extended to include description, category, etc.

3. **Performance**:
   - The current implementation has O(n) time complexity for searching
   - For large datasets, more efficient search algorithms or indexing would be needed

4. **Other Limitations**:
   - No authentication mechanism
   - No rate limiting
   - No caching strategy

## Future Improvements

1. **Database Integration**:
   - Replace in-memory storage with a proper database
   - Implement indexing for search fields

2. **Advanced Search**:
   - Add filters for price range, category, etc.
   - Implement fuzzy search for typo tolerance

3. **Performance Optimizations**:
   - Add caching layer
   - Implement more sophisticated search algorithms for larger datasets

4. **Security Enhancements**:
   - Add authentication and authorization
   - Implement rate limiting