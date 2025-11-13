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
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-newpass',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './newpass.component.html',
  styleUrl: './newpass.component.css'
})
export class NewpassComponent implements OnDestroy {
  resetPassSub: any;

  constructor(private _authService: AuthService, private _router: Router) {}

  resetForm: FormGroup = new FormGroup(
    {
      email: new FormControl(null, [Validators.required, Validators.email]),
      newPassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      rePassword: new FormControl(null, Validators.required),
    },
    [this.confirmPassword]
  );

  confirmPassword(form: AbstractControl) {
    let passControl = form.get('newPassword');
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

  resetPass() : void {
        if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
    } else {
      console.log(this.resetForm);
      this.resetPassSub = this._authService
        .resetPassword(this.resetForm.value)
        .subscribe({
          next: (response) => {
            console.log('Password updated:', response);
            this._router.navigate(['signin']);
          },
          error: (error) => console.log(error),
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
