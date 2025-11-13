import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-resetpass',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './resetpass.component.html',
  styleUrl: './resetpass.component.css',
})
export class ResetpassComponent implements OnDestroy {
  resetPassSub: any;

  constructor(private _authService: AuthService, private _router: Router) {}

  resetForm: FormGroup = new FormGroup(
    {
      currentPassword: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      rePassword: new FormControl(null, Validators.required),
    },
    [this.confirmPassword]
  );

  confirmPassword(form: AbstractControl) {
    let passControl = form.get('password');
    let rePassControl = form.get('rePassword');

    if (!passControl || !rePassControl) return null;

    let pass = passControl.value;
    let rePass = rePassControl.value;

    if (pass === rePass) {
      // clear mismatch error if previously set
      if (rePassControl.hasError('mismatch')) {
        rePassControl.setErrors(null);
      }
      return null;
    } else {
      // set mismatch error on rePassword control
      rePassControl.setErrors({ mismatch: true });
      return { mismatch: true };
    }
  }

  updatePass(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
    } else {
      console.log(this.resetForm);
      this.resetPassSub = this._authService
        .updatePassword(this.resetForm.value)
        .subscribe({
          next: (response) => {
            console.log('Password updated:', response);
            this._authService.logOut();
            this._router.navigate(['signin']);
          },
          error: (error) => {
          alert(error.error.message);
          console.log(error);
        },
          complete: () => console.log('Completed'),
        });
    }
  }

  ngOnDestroy(): void {
    console.log('🧹 ResetPass Component destroyed');
    if (this.resetPassSub) {
      this.resetPassSub.unsubscribe();
      console.log('✅ Unsubscribed ResetPass');
    }
  }
}
