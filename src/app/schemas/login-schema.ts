import z from 'zod';

export const loginSchema = z.object({
  email: z.email({ error: 'Email is not valid' }),
  password: z.string().min(1, { error: 'Password is required' }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
