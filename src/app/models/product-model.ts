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

export class CartProductModel {
  totalItems!: number;
  totalPrice!: number;
  items!: CartItem[];
}

export class CartItem {
  id!: number;
  quantity!: number;
  product!: CartProduct;
}

export class CartProduct {
  id!: number;
  name!: string;
  description!: string;
  vegeterian!: string;
  spiciness!: number;
  rate!: number;
  price!: number;
  image!: string;
  canDelete!: boolean;
}
