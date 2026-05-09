import { CreateCategorySchema } from '../../schemas/admin/create-category-schema';

export class CreateCategoryModel implements CreateCategorySchema {
  name!: string;
}
