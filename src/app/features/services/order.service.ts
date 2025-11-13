import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { orderAddress } from '../interfaces/orders';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  orderBaseUrl: string = 'https://ecommerce.routemisr.com/api/v1/orders';

  constructor(private _httpClient: HttpClient) {}

  createCashOrder(cartId: string, address: orderAddress): Observable<any> {
    return this._httpClient.post(`${this.orderBaseUrl}/${cartId}`, address)
  }

  createCheckoutSession(cartId: string, address: orderAddress): Observable<any> {
    return this._httpClient.post(`${this.orderBaseUrl}/checkout-session/${cartId}?url=https://ecommerce-angular-cyan.vercel.app`, address)
  }

  // gets all orders for all users - better be called from admin access
  getAllOrders(): Observable<any> {
    return this._httpClient.get(this.orderBaseUrl);
  }

  getUserOrders(userId: string): Observable<any> {
    return this._httpClient.get(`${this.orderBaseUrl}/user/${userId}`);
  }

}
