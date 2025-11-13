import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Signup } from '../interfaces/signup';
import { Signin, User } from '../interfaces/signin';
import { jwtDecode } from 'jwt-decode'; // npm install jwt-decode
import { forgotPass, resetPass } from '../interfaces/password';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  signUpPostUrl: string = 'https://ecommerce.routemisr.com/api/v1/auth/signup';
  signInPostUrl: string = 'https://ecommerce.routemisr.com/api/v1/auth/signin';

  getUsersUrl: string = 'https://ecommerce.routemisr.com/api/v1/users';

  updateUserDataUrl: string = 'https://ecommerce.routemisr.com/api/v1/users/updateMe/'

  updateUserPassUrl: string = 'https://ecommerce.routemisr.com/api/v1/users/changeMyPassword'
  
  forgotPassUrl: string = 'https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords'
  verfiyCodeUrl: string = 'https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode'
  resetPassUrl: string = 'https://ecommerce.routemisr.com/api/v1/auth/resetPassword'

  private userData = new BehaviorSubject<any>(null);

  constructor(private _httpClient: HttpClient) {
    const token = this.getUserToken();
    if (token) {
      this.decodeUserToken(); // decode upon app start/refresh
    }
  }

  signUp(data: Signup): Observable<any> {
    return this._httpClient.post(this.signUpPostUrl, data);
  }

  login(data: Signin): Observable<any> {
    return this._httpClient.post(this.signInPostUrl, data);
  }

  saveUserToken(token: string): void {
    localStorage.setItem('userToken', token);
  }

  getUserToken(): string | null {
    return localStorage.getItem('userToken');
  }

  decodeUserToken(): void {
    const token = this.getUserToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userData.next(decoded);
    }
  }

  getUserData(): Observable<any> {
    return this.userData.asObservable();
  }

  getUserById(): Observable<any> {
    const token = this.getUserToken();
    if (!token) throw new Error('No token found');

    const decoded: any = jwtDecode(token);
    const userId = decoded.id; // Adjust if token key differs (e.g. "_id" or "userId")
    return this._httpClient.get(`${this.getUsersUrl}/${userId}`);
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('userToken') !== null) {
      return true;
    } else {
      return false;
    }
  }

  logOut(): void {
    localStorage.removeItem('userToken');
    this.userData.next(null);
  }

  updateUserData(userData: any): Observable<any> {
    return this._httpClient.put(this.updateUserDataUrl, userData)
  }

  updatePassword(data: resetPass): Observable<any> {
    return this._httpClient.put(this.updateUserPassUrl, data)
  }

  forgotPass(email: string): Observable<any> {
    return this._httpClient.post(this.forgotPassUrl, email)
  }

  verifyCode(resetCode: string): Observable<any> {
    return this._httpClient.post(this.verfiyCodeUrl, resetCode)
  }

  resetPassword(data: forgotPass): Observable<any> {
    return this._httpClient.put(this.resetPassUrl, data)
  }

}
