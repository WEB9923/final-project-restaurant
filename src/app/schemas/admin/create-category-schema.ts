import z from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, { error: 'Category name is required' })
    .min(3, { error: 'At least 3 characters is required' }),
});

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
