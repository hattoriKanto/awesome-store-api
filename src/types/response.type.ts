import { Product } from '@prisma/client';

export type ProductsResponse = {
  products: Product[];
  totalProducts: number;
  totalPages: number;
  nextPage: number | null;
};

export type SuccessResponse = {
  success: boolean;
  messages: string;
  timestamp: string;
};
