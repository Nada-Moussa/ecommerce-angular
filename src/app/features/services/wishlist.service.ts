import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  wishlistUrl: string = 'https://ecommerce.routemisr.com/api/v1/wishlist';
  wishlistSub: any;

  constructor(private _httpClient: HttpClient) {}

  // http methods
  getWishlist(): Observable<any> {
    return this._httpClient.get(this.wishlistUrl);
  }

  postWishlist(productId: string): Observable<any> {
    return this._httpClient.post(this.wishlistUrl, { productId });
  }

  deleteFromWishlist(productId: string): Observable<any> {
    return this._httpClient.delete(`${this.wishlistUrl}/${productId}`);
  }

  // shared methods
  addToWishlist(productId: string): void {
    console.log(productId);
    this.wishlistSub = this.postWishlist(productId).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => console.log(error),
      complete: () => console.log('Completed'),
    });
  }

  removeFromWishlist(productId: string): void {
    this.wishlistSub = this.deleteFromWishlist(productId).subscribe({
      next: (response) => {
        console.log('Removed from wishlist:', response);
      },
      error: (error) => console.log(error),
      complete: () => console.log('Completed'),
    });
  }

  loadWishlist(wishlist: string[]): void {
  this.wishlistSub = this.getWishlist().subscribe({
    next: (response) => {
      wishlist.length = 0; // clear existing items
      wishlist.push(...response.data.map((item: any) => item.id)); // add new items
      console.log(wishlist);
    },
    error: (error) => console.log(error),
  });
}
}
