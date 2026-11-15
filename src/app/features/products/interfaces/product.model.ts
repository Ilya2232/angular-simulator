export interface IProduct {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
}

export interface IProductDetail extends IProduct {
  description: string;
  discountPercentage: number;
  brand?: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  dimensions?: { width: number; height: number; depth: number };
  images: string[];
}

export interface IProductResponse {
  products: IProduct[];
  total: number;
  skip: number;
  limit: number;
}

export interface ICategory {
  slug: string;
  name: string;
  url: string;
}

export type ProductSortField = 'title' | 'price' | 'rating' | 'stock';
export type SortOrder = 'asc' | 'desc';

export interface IProductQuery {
  limit: number;
  skip: number;
  search: string;
  category: string | null;
  sortBy: ProductSortField;
  order: SortOrder;
}
