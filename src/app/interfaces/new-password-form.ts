import { NewPasswordModel } from '../models/new-password-model';

export interface NewPasswordField {
  type: string;
  placeholder: string;
  label: string;
  name: keyof NewPasswordModel;
}
