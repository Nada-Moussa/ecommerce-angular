import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';


export const authInterceptor: HttpInterceptorFn = (req, next) => {

  let _authService = inject(AuthService);
  let token = _authService.getUserToken();

  // only add header if token exists
  let authReq = req; 

  if (token) {
    console.log('🔐 Interceptor attached token:', token);
    // if a token exists, clone the request and add the Authorization header
    authReq = req.clone({
      setHeaders: {
        Token: token
      }
    });
  }
  else {
    console.log('⚠️ No token found, sending request without auth header.');
  }
  
  return next(authReq);
};
