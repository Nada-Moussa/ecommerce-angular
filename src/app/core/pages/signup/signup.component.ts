import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})

export class SignupComponent implements OnDestroy {

  signupSub: any;

  signUpPostUrl: string = "https://ecommerce.routemisr.com/api/v1/auth/signup"

  constructor(private _authService: AuthService, private _router:Router) { }

  registerForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    rePassword: new FormControl(null, Validators.required),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
  }, [this.confirmPassword])

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

  register():void {
    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();
    }
    else {
      console.log(this.registerForm);
      this.signupSub = this._authService.signUp(this.registerForm.value).subscribe({
        next: (response) => {
          this._authService.saveUserToken(response.token);
          console.log('Token saved:', response.token);
          console.log(response)
          this._router.navigate(['signin']);
        },
        error: (error) => {
          alert(error.error.message);
          console.log(error);
        },
        complete: () => console.log("Completed")
      })
    }
  }

  ngOnDestroy(): void {
    console.log('🧹 Signup Component destroyed');
    if (this.signupSub) {
      this.signupSub.unsubscribe()
      console.log('✅ Unsubscribed Signup');
    }
  }

}
