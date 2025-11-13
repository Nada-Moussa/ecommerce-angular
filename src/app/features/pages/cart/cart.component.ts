import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart, CartItem } from '../../interfaces/cart';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit, OnDestroy {
  cartSub: any;
  cartItems: CartItem[] = [];
  cart: Cart = {
    _id: '',
    cartOwner: '',
    products: [],
    totalCartPrice: 0,
  };

  cartLoaded: boolean = false;
  clearingCart: boolean = false;
  loadingRemoveId: string | null = null;
  updatingQuantityId: string | null = null;

  constructor(private _cartService: CartService, private _router: Router) {}

  ngOnInit(): void {
    this.getCart();
  }

  getCart(): void {
    this.cartSub = this._cartService.getCart().subscribe({
      next: (response) => {
        this.cart = response.data;
        console.log(this.cart);
        this.cartItems = this.cart.products;
        console.log(this.cartItems);
        this.cartLoaded = true;
      },
      error: (error) => console.log(error),
      complete: () => console.log('Completed'),
    });
  }

  removeFromCart(productId: string): void {
    this.loadingRemoveId = productId;
    this.cartSub = this._cartService.deleteFromCart(productId).subscribe({
      next: (response) => {
        console.log('Removed from wishlist:', response);
        this.loadingRemoveId = null;
        // filter out the removed item
        this.cartItems = this.cartItems.filter(
          (item) => item.product.id !== productId
        );
      },
      error: (error) => {
        console.log(error);
        this.loadingRemoveId = null;
      },
      complete: () => console.log('Completed'),
    });
  }

  clearCart(): void {
    this.clearingCart = true;
    this.cartSub = this._cartService.clearCart().subscribe({
      next: (response) => {
        console.log(response);
        // clear the cart items
        this.cartItems = [];
        this.getCart();
        this.clearingCart = false;
      },
      error: (error) => {
        console.log(error);
        this.clearingCart = false;
      },
      complete: () => console.log('Completed'),
    });
  }

  updateItemQuantity(productId: string, count: number): void {
    if (count < 1) {
      // if user removes last item - remove the item itself from cart
      this.removeFromCart(productId);
      this.getCart();
      return;
    }
    this.updatingQuantityId = productId;
    this.cartSub = this._cartService
      .updateItemQuantity(productId, count)
      .subscribe({
        next: (response) => {
          this.cart = response.data;
          console.log(this.cart);
          this.cartItems = this.cart.products;
          console.log(this.cartItems);
          this.updatingQuantityId = null;
        },
        error: (error) => {
          console.log(error);
          this.updatingQuantityId = productId;
        },
        complete: () => console.log('Completed'),
      });
  }

  checkout(): void {
    this._router.navigate(['cart/checkout']);
  }

  ngOnDestroy(): void {
    console.log('🧹 cart Component destroyed');
    if (this.cartSub) {
      this.cartSub.unsubscribe();
      console.log('✅ Unsubscribed Cart');
    }
  }
}
