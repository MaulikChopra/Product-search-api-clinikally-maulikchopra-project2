import fs from "fs";
import path from "path";
import { Product, SearchResult } from "../types/product";

class ProductService {
  private products: Product[] = [];

  constructor() {
    this.loadProducts();
  }

  private loadProducts(): void {
    try {
      const productsPath = path.join(__dirname, "../data/products.json");
      const data = fs.readFileSync(productsPath, "utf8");
      this.products = JSON.parse(data);
    } catch (error) {
      console.error("Error loading products:", error);
      this.products = [];
    }
  }

  searchProducts(query: string, limit: number, skip: number): SearchResult {
    if (!query || query.length < 2) {
      throw new Error("Query must be at least 2 characters long");
    }

    const normalizedQuery = query.toLowerCase();

    // Score and filter products
    const scoredProducts = this.products
      .map((product) => {
        const titleLower = product.title.toLowerCase();
        const brandLower = product.brand?.toLowerCase() || "";

        // Calculate score based on different match types
        let score = 0;

        // Exact matches in title (highest priority)
        if (titleLower === normalizedQuery) {
          score += 100;
        }

        // Title starts with query (high priority)
        else if (titleLower.startsWith(normalizedQuery)) {
          score += 75;
        }

        // Title contains query (medium priority)
        else if (titleLower.includes(normalizedQuery)) {
          score += 50;
        }

        // Brand matches exactly (medium-high priority)
        if (brandLower === normalizedQuery) {
          score += 60;
        }

        // Brand starts with query (medium priority)
        else if (brandLower.startsWith(normalizedQuery)) {
          score += 40;
        }

        // Brand contains query (lower priority)
        else if (brandLower.includes(normalizedQuery)) {
          score += 30;
        }

        return { product, score };
      })
      .filter((item) => item.score > 0) // Only include products that match
      .sort((a, b) => b.score - a.score) // Sort by score (descending)
      .map((item) => item.product); // Extract just the product

    const paginatedProducts = scoredProducts.slice(skip, skip + limit);

    return {
      products: paginatedProducts,
      total: scoredProducts.length,
      skip,
      limit,
    };
  }
}

export default new ProductService();
