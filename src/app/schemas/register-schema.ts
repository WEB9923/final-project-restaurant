import z from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(1, { error: 'First name is required' }),
  lastName: z.string().min(1, { error: 'Last name is required' }),
  email: z.email({ error: 'Invalid email address' }),
  password: z.string().superRefine((val, ctx): void => {
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
});

// export const registerSchema = z.object({
//   firstName: z.string().min(1, { error: 'First name is required' }),
//   lastName: z.string().min(1, { error: 'Last name is required' }),
//   email: z.email({ error: 'Invalid email address' }),
//   password: z
//     .string()
//     .min(1, { error: 'Password is required' })
//     .min(8, { error: 'At least 8 characters required' })
//     .regex(/[a-z]/, { error: 'Must include lowercase letter' })
//     .regex(/[A-Z]/, { error: 'Must include uppercase letter' })
//     .regex(/[0-9]/, { error: 'Must include at least one number' })
//     .regex(/[!@#$%^&*()_+]/, {
//       message: 'Must include at least one special character',
//     }),
// });

export type RegisterSchema = z.infer<typeof registerSchema>;
