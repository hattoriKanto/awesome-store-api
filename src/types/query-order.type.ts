import { Product } from '@prisma/client';

export enum SortOrderQuery {
  desc = 'desc',
  asc = 'asc',
}

export const sortByValues = Object.values(SortOrderQuery);

export type OrderByQuery = keyof Pick<
  Product,
  'createdAt' | 'price' | 'category' | 'amount'
>;

export const orderByValues = ['amount', 'category', 'createdAt', 'price'];
