import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AddressService } from '../../services/address.service';
import { Address } from '../../interfaces/address';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  decodedData: any;
  userData: any;
  userSub: any;
  addressSub: any;
  isEditing = false;
  isAddingAddress = false;
  showAddDetails = false; 
  addressList: Address[] = [];

  userDataLoaded: boolean = false;
  addressesLoaded: boolean = false;

  constructor(
    private _authService: AuthService,
    private _addressService: AddressService,
    private _router: Router
  ) {}

  updateForm: FormGroup = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/),
    ]),
  });

  addressForm: FormGroup = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    details: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
    ]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/),
    ]),
    city: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
  });

  ngOnInit(): void {
    // Get decoded data from BehaviorSubject
    this._authService.getUserData().subscribe({
      next: (decoded) => {
        this.decodedData = decoded;
        console.log('Decoded Token:', this.decodedData);
      },
    });

    // Get full user info from API
    this.getUserDetails();

    // Get user address
    this.getAddresses();
  }

  getUserDetails(): void {
    this.userSub = this._authService.getUserById().subscribe({
      next: (response) => {
        console.log('User details:', response.data);
        this.userData = response.data;
        // populate the update data with current user data
        this.updateForm.patchValue({
          name: this.userData.name,
          email: this.userData.email,
          phone: this.userData.phone,
        });
        this.userDataLoaded = true;
      },
      error: (error) => console.log(error),

      complete: () => console.log('Completed'),
    });
  }

  toggleDetailsEdit(): void {
    this.isEditing = !this.isEditing;
  }

  toggleAddressEdit(): void {
    this.isAddingAddress = !this.isAddingAddress;
    console.log(this.isAddingAddress);
  }

  updateProfile(): void {
    if (this.updateForm.valid) {
      var updatedData: any = {};

      // Only include fields modified by user
      Object.keys(this.updateForm.controls).forEach((key) => {
        const control = this.updateForm.get(key);
        if (control?.value !== this.userData[key]) {
          updatedData[key] = control?.value;
        }
      });

      if (Object.keys(updatedData).length === 0) {
        alert('No changes detected.');
        return;
      }

      this._authService.updateUserData(updatedData).subscribe({
        next: (response) => {
          console.log('✅ Profile updated successfully:', response);
          alert('Profile updated successfully!');
          this.userData = { ...this.userData, ...updatedData };
        },
        error: (error) => console.log(error),
      });
    }
    this.isEditing = false;
  }

  goToChangePass(): void {
    this._router.navigate(['profile/resetpass']);
  }

  getAddresses(): void {
    this.addressSub = this._addressService.getAddresses().subscribe({
      next: (response) => {
        this.addressList = response.data;
        console.log(this.addressList);
        this.addressesLoaded = true;
      },
      error: (error) => console.log(error),
      complete: () => console.log('Completed'),
    });
  }

  addAddress(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
    } else {
      this.addressSub = this._addressService
        .postAddress(this.addressForm.value)
        .subscribe({
          next: (response) => {
            console.log(response.data);
            this.addressList = response.data
            this.addressForm.reset();
            this.isAddingAddress = false;
          },
          error: (error) => console.log(error),
          complete: () => console.log('Completed'),
        });
    }
  }

  addDetails(addId: string): void {
    this.addressSub = this._addressService.getSpecificAdd(addId).subscribe({
      next: (response) => {
        console.log(response.data);
      },
      error: (error) => console.log(error),
      complete: () => console.log('Completed')
    });
  }

  removeAddress(addId: string): void {
    this.addressSub = this._addressService.deleteAddress(addId).subscribe({
      next: (response) => {
        console.log(response.data);
        //filter out the removed addresses
        this.addressList = this.addressList.filter(
          (item) => item._id !== addId
        );
      },
      error: (error) => console.log(error),
      complete: () => console.log('Completed'),
    });
  }
}
