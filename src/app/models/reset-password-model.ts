import { ResetPasswordSchema } from '../schemas/reset-password-schema';

export class ResetPasswordModel implements ResetPasswordSchema {
  newPassword!: string;
  newPasswordConfirm!: string;
}
