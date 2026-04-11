import { MeModel } from './me-model';

export class ProfileModel extends MeModel {
  createdAt!: Date;
  updatedAt!: Date;
  phoneNumber?: string;
  picture?: string;
  address?: string;
  age?: number;
}
