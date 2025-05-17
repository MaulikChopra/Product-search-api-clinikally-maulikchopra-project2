export interface Product {
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

export interface SearchResult {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface SearchParams {
  q: string;
  limit: number;
  skip: number;
}