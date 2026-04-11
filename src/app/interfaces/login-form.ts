import { TInput } from './register-form';

export interface ILoginForm {
  type: TInput;
  placeholder: string;
  label: string;
  name: string;
  isPassword?: boolean;
  showPassword?: boolean;
}

export interface ILoginModel {
  email: string;
  password: string;
}
