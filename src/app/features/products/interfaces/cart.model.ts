export interface ICartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

export interface ICartResponse {
  id: number;
  userId: number;
  products: ICartItem[];
}

export interface ICartPayload {
  userId?: number;
  products: { id: number; quantity: number }[];
}
