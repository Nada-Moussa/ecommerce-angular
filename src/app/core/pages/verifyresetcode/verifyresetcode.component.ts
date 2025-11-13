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
  selector: 'app-verifyresetcode',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './verifyresetcode.component.html',
  styleUrl: './verifyresetcode.component.css',
})
export class VerifyresetcodeComponent {
  verifyCodeSub: any;

  constructor(private _authService: AuthService, private _router: Router) {}

  verifyCodeForm: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^\d{6}$/),
    ]),
  });

  verifyCode(): void {
    if (this.verifyCodeForm.invalid) {
      this.verifyCodeForm.markAllAsTouched();
    } else {
      console.log(this.verifyCodeForm);
      this.verifyCodeSub = this._authService
        .verifyCode(this.verifyCodeForm.value)
        .subscribe({
          next: (response) => {
            console.log(response);
            this._router.navigate(['signin/newpass']);
          },
          error: (error) => {
          alert(error.error.message);
          console.log(error);
        },
          complete: () => console.log('Completed'),
        });
    }
  }
}
