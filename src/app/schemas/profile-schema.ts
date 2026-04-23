import z from 'zod';

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, { error: 'Please enter first name' }).optional(),
  lastName: z.string().trim().min(1, { error: 'Please enter last name' }).optional(),
  age: z.coerce.number({ error: 'Please enter age' }).min(15, { error: 'Minimum age is 15' }),
  phoneNumber: z.string().trim().length(9, { error: 'Invalid mobile number' }).optional(),
  picture: z.url({ error: 'Invalid url format' }).optional(),
  address: z.string().trim().min(1, { error: 'Please enter address' }).optional(),
  email: z.email({ error: 'Invalid email address' }),
});
export type ProfileSchema = z.infer<typeof profileSchema>;

export const newPasswordSchema = z
  .object({
    oldPassword: z.string().min(1, { error: 'Password is required' }),
    newPassword: z.string().superRefine((val, ctx): void => {
      if (!val) {
        ctx.addIssue({ code: 'custom', message: 'Password is required' });
      } else if (val.length < 8) {
        ctx.addIssue({ code: 'custom', message: 'At least 8 characters required' });
      } else if (!/[a-z]/.test(val)) {
        ctx.addIssue({ code: 'custom', message: 'Must include lowercase letter' });
      } else if (!/[A-Z]/.test(val)) {
        ctx.addIssue({ code: 'custom', message: 'Must include uppercase letter' });
      } else if (!/[0-9]/.test(val)) {
        ctx.addIssue({ code: 'custom', message: 'Must include at least one number' });
      } else if (!/[^A-Za-z0-9]/.test(val)) {
        ctx.addIssue({ code: 'custom', message: 'Must include special character' });
      }
    }),
    confirmPassword: z.string(),
  })
  .refine((val): boolean => val.newPassword === val.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  });
