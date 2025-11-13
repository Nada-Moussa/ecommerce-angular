import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartUrl: string = 'https://ecommerce.routemisr.com/api/v1/cart';
  cartSub: any;

  constructor(private _httpClient: HttpClient) {}

  // http methods
  getCart(): Observable<any> {
    return this._httpClient.get(this.cartUrl);
  }

  postCart(productId: string): Observable<any> {
    return this._httpClient.post(this.cartUrl, { productId });
  }

  deleteFromCart(productId: string): Observable<any> {
    return this._httpClient.delete(`${this.cartUrl}/${productId}`);
  }

  updateItemQuantity(productId: string, count: number): Observable<any> {
    return this._httpClient.put(`${this.cartUrl}/${productId}`, { count });
  }

  clearCart(): Observable<any> {
    return this._httpClient.delete(this.cartUrl);
  }

  // shared methods
  addToCart(productId: string): void {
    console.log(productId);
    this.cartSub = this.postCart(productId).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => console.log(error),
      complete: () => console.log('Completed'),
    });
  }

  removeFromCart(productId: string): void {
    this.cartSub = this.deleteFromCart(productId).subscribe({
      next: (response) => {
        console.log('Removed from cart:', response);
      },
      error: (error) => console.log(error),
      complete: () => console.log('Completed'),
    });
  }

  loadCart(cart: string[]): void {
    this.cartSub = this.getCart().subscribe({
      next: (response) => {
        cart.length = 0;
        cart.push(...response.data.products.map((item: any) => item.product.id));
        console.log(cart);
      },
      error: (error) => console.log(error),
    });
  }
}
