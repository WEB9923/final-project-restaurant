import z from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, { error: 'Product name is required' }),
  description: z.string().min(1, { error: 'Product description is required' }),
  price: z
    .number()
    .min(1, { error: 'Product price is required' })
    .nonnegative({ error: 'Product price must be greater than 0' })
    .default(0),
  image: z.url({ error: 'Url format is not valid' }),
  categoryId: z.number().min(1, { error: 'Category is required' }).nullable(),
  spiciness: z.number().min(1, { error: 'Product spiciness is required' }).nullable(),
  vegetarian: z.boolean().default(false),
  method: z.string().min(1, { error: 'Cooking method is required' }),
  ingredients: z.array(z.string()).min(1, { error: 'Cooking ingredients is required' }),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
