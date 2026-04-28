import z from 'zod';

export const resetPasswordSchema = z
  .object({
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
    newPasswordConfirm: z.string(),
  })
  .refine((val): boolean => val.newPassword === val.newPasswordConfirm, {
    error: 'Passwords do not match',
    path: ['newPasswordConfirm'],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
