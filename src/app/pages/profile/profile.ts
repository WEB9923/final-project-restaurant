import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service';
import { NgClass } from '@angular/common';
import { ProfileField, ProfileFormModel } from '../../interfaces/profile-form';
import { FormsModule } from '@angular/forms';
import { SideRibbon } from '../../components/ui/side-ribbon/side-ribbon';
import { NewPasswordField } from '../../interfaces/new-password-form';
import { NewPasswordModel } from '../../models/new-password-model';
import { PasswordPrerequisite } from '../../components/ui/password-prerequisite/password-prerequisite';
import { DialogService } from '../../services/dialog-service';

@Component({
  selector: 'app-profile',
  imports: [NgClass, FormsModule, SideRibbon, PasswordPrerequisite],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user = inject(UserService);
  dialog = inject(DialogService);

  profileFormModel: ProfileFormModel = {
    firstName: '',
    lastName: '',
    age: 18,
    phoneNumber: '',
    picture: '',
    address: '',
    email: '',
  };

  newPasswordFormModel: NewPasswordModel = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  profileFields: ProfileField[] = [
    {
      type: 'text',
      name: 'picture',
      label: 'Profile picture',
      gridCols: 2,
      placeholder: 'Picture url',
    },
    {
      type: 'text',
      name: 'firstName',
      label: 'First name',
      gridCols: 1,
      placeholder: 'John',
    },
    {
      type: 'text',
      name: 'lastName',
      label: 'Last name',
      gridCols: 1,
      placeholder: 'Doe',
    },
    {
      type: 'email',
      name: 'email',
      label: 'Email',
      gridCols: 2,
      placeholder: 'Email',
    },
    {
      type: 'text',
      name: 'phoneNumber',
      label: 'Phone number',
      gridCols: 2,
      placeholder: 'Phone number',
    },
    {
      type: 'text',
      name: 'address',
      label: 'Address',
      gridCols: 2,
      placeholder: 'Your address',
    },
    {
      type: 'number',
      name: 'age',
      label: 'Age',
      gridCols: 2,
      placeholder: '26',
    },
  ];

  newPasswordFields: NewPasswordField[] = [
    {
      type: 'password',
      name: 'oldPassword',
      label: 'Old password',
      placeholder: '••••••••••',
    },
    {
      type: 'password',
      name: 'newPassword',
      label: 'New password',
      placeholder: '••••••••••',
    },
    {
      type: 'password',
      name: 'confirmPassword',
      label: 'Confirm new password',
      placeholder: '••••••••••',
    },
  ];

  handleUpdateProfile(evt: SubmitEvent) {
    evt.preventDefault();

    this.user
      .updateProfile({
        phoneNumber: this.profileFormModel.phoneNumber,
        firstName: this.profileFormModel.firstName,
        lastName: this.profileFormModel.lastName,
        age: this.profileFormModel.age,
        address: this.profileFormModel.address,
        picture: this.profileFormModel.picture,
      })
      .subscribe();
  }

  handleUpdatePassword(evt: SubmitEvent): void {
    evt.preventDefault();

    this.user.updatePassword(this.newPasswordFormModel).subscribe();
  }

  showDialog(): void {
    this.dialog.open({
      title: 'Delete account',
      description:
        'Are you sure you want to delete your account? This action cannot be undone. Your account will be deleted permanently.',
      actionText: 'Delete permanently',
      onAction: (): void => {
        this.user.deleteAccount().subscribe();
      },
    });
  }

  ngOnInit(): void {
    this.user.fetchProfile().subscribe({
      next: ({ data }): void => {
        this.profileFormModel = {
          email: data.email,
          picture: data.picture,
          phoneNumber: data.phoneNumber,
          lastName: data.lastName,
          firstName: data.firstName,
          address: data.address,
          age: data.age,
        };
      },
    });
  }
}
