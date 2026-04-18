export class ProductModel {
  id!: number;
  name!: string;
  description!: string;
  vegeterian!: boolean;
  spiciness!: number;
  rate!: number;
  price!: number;
  image!: string;
  canDelete!: boolean;
}

export class SingleProductModel {
  name!: string;
  description!: string;
  vegetarian!: boolean;
  spiciness!: number;
  rate!: number;
  price!: number;
  image!: string;
  method!: string;
  ingredients!: string[];
  categoryId!: number;
  id!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
