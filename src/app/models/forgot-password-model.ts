import { ForgotPassword } from '../schemas/forgot-password-schema';

export class ForgotPasswordModel implements ForgotPassword {
  email!: string;
}
