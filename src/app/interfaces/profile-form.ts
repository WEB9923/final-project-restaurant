import { ProfileModel } from '../models/profile-model';

export type ProfileFormModel = Pick<
  ProfileModel,
  'firstName' | 'lastName' | 'age' | 'phoneNumber' | 'picture' | 'address' | 'email'
>;

export interface ProfileField {
  type: string;
  placeholder: string;
  label: string;
  name: keyof ProfileFormModel;
  gridCols: 1 | 2;
}
