import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-forgotpass',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forgotpass.component.html',
  styleUrl: './forgotpass.component.css',
})
export class ForgotpassComponent implements OnDestroy {
  forgotPassSub: any;

  constructor(private _authService: AuthService, private _router: Router) {}

  forgotPassForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  forgotPass(): void {
    if (this.forgotPassForm.invalid) {
      this.forgotPassForm.markAllAsTouched();
    } else {
      console.log(this.forgotPassForm);
      this.forgotPassSub = this._authService
        .forgotPass(this.forgotPassForm.value)
        .subscribe({
          next: (response) => {
            console.log(response);
            this._router.navigate(['signin/verifyresetcode']);
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
    console.log('🧹 ForgotPass Component destroyed');
    if (this.forgotPassSub) {
      this.forgotPassSub.unsubscribe();
      console.log('✅ Unsubscribed ForgotPass');
    }
  }
}
