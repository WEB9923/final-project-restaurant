import { CreateProductSchema } from '../../schemas/admin/create-product-schema';

export class CreateProductModel implements CreateProductSchema {
  name!: string;
  description!: string;
  image!: string;
  categoryId!: number | null;
  price!: number;
  ingredients!: string[];
  method!: string;
  spiciness!: number | null;
  vegetarian!: boolean;
}
