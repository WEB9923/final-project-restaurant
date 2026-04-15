export interface ProductFilter {
  search?: string;
  categoryId?: number;
  page?: number;
  take?: number;
  vegetarian?: boolean;
  minPrice?: number;
  maxPrice?: number;
}
