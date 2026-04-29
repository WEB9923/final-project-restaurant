export interface ProductFilter {
  search?: string;
  categoryId?: number;
  page?: number;
  take?: number;
  vegetarian?: boolean;
  spiciness?: number;
  minPrice?: number;
  maxPrice?: number;
}
