import { loginSchema } from './login-schema';
import z from 'zod';

export const forgotPasswordSchema = loginSchema.pick({ email: true });

export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
