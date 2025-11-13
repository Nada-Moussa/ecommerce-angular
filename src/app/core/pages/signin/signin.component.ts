import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})

export class SigninComponent {

  signinSub: any;

  constructor(private _authService: AuthService, private _router: Router) { }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
  })

  login(): void {
    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();
    }
    else {
      console.log(this.loginForm);

      this.signinSub = this._authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log(response);
          // Save the token you get from the response
          this._authService.saveUserToken(response.token);
          this._authService.decodeUserToken();
          // Redirect to homepage
          this._router.navigate(['/home']);
        },
        error: (error) => {
          alert(error.error.message);
          console.log(error);
        },
        complete: () => console.log("Completed")
      });

    }
  }

  resetPass(): void {
    this._router.navigate(['/signin/forgotpass'])

  }

  ngOnDestroy(): void {
  console.log('🧹 Signin Component destroyed');  
  if (this.signinSub) {
    this.signinSub.unsubscribe();
    console.log('✅ Unsubscribed Signin');
  }
}
}
