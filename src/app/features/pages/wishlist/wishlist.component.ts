import { Component } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { WishlistService } from '../../services/wishlist.service';
import { Router } from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core';
import { Products } from '../../interfaces/products';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistSub: any;
  cartSub: any;
  wishlistItems: Products[] = [];
  wishlistLoaded: boolean = false;

  loadingRemoveId: string | null = null;
  loadingAddId: string | null = null;

  constructor(
    private _productsService: ProductsService,
    private _wishlistService: WishlistService,
    private _cartService: CartService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.getWishList();
  }

  prodDetails(prodId: string): void {
    this._router.navigate(['products/product_details', prodId]);
  }

  getWishList(): void {
    this.wishlistSub = this._wishlistService.getWishlist().subscribe({
      next: (response) => {
        this.wishlistItems = response.data;
        console.log(this.wishlistItems);
        this.wishlistLoaded = true;
      },
      error: (error) => console.log(error),
      complete: () => console.log('Completed'),
    });
  }

  removeFromWishlist(productId: string): void {
    this.loadingRemoveId = productId;
    this.wishlistSub = this._wishlistService
      .deleteFromWishlist(productId)
      .subscribe({
        next: (response) => {
          console.log('Removed from wishlist:', response);
          this.loadingRemoveId = null;
          // filter out the removed item
          this.wishlistItems = this.wishlistItems.filter(
            (item) => item.id !== productId
          );
        },
        error: (error) => {
          console.log(error);
          this.loadingRemoveId = null;
        },
        complete: () => console.log('Completed'),
      });
  }

  addToCart(productId: string): void {
    this.loadingAddId = productId;
    console.log(productId);
    this.cartSub = this._cartService.postCart(productId).subscribe({
      next: (response) => {
        console.log(response);
        this.loadingAddId = null;
        this._wishlistService.deleteFromWishlist(productId).subscribe({
          next: () => {
            this.loadingAddId = null;
            this.wishlistItems = this.wishlistItems.filter(
              (item) => item.id !== productId
            );
          },
          error: () => {
            this.loadingAddId = null;
          }
        });
      },
      error: (error) => {
        console.log(error);
        this.loadingAddId = null;
      },
      complete: () => console.log('Completed'),
    });
  }

  ngOnDestroy(): void {
    console.log('🧹 Wishlist Component destroyed');
    if (this.wishlistSub) {
      this.wishlistSub.unsubscribe();
      console.log('✅ Unsubscribed Wishlist');
    }
  }
}
