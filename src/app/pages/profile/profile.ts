import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service';
import { NgClass } from '@angular/common';
import { ProfileField, ProfileFormModel } from '../../interfaces/profile-form';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [NgClass, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user = inject(UserService);

  profileFormModel: ProfileFormModel = {
    firstName: '',
    lastName: '',
    age: 18,
    phoneNumber: '',
    picture: '',
    address: '',
    email: '',
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

  ngOnInit(): void {
    this.user.fetchProfile().subscribe({
      next: ({ data }) => {
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
