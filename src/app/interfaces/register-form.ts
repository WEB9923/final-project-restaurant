export interface IRegisterForm {
  type: TInput;
  placeholder: string;
  label: string;
  name: string;
  isPassword?: boolean;
  showPassword?: boolean;
  gridCols: 1 | 2;
}

export type TInput = 'email' | 'password' | 'text';

export interface IRegisterModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
