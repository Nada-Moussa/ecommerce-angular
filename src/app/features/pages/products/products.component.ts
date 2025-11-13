import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { OnInit, OnDestroy } from '@angular/core';
import { Products } from '../../interfaces/products';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit, OnDestroy {
  allProdSub: any;
  allProds: Products[] = [];
  productsLoaded: boolean = false;

  wishlist: string[] = []; // holds product ids for products added to wishlist
  cart: string[] = []; // holds product ids for products added to cart

  constructor(
    private _productsService: ProductsService,
    private _wishlistService: WishlistService,
    private _cartService: CartService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.getAllProds();
    this._wishlistService.loadWishlist(this.wishlist);
    this._cartService.loadCart(this.cart);
  }

  prodDetails(prodId: string): void {
    this._router.navigate(['products/product_details', prodId]);
  }

  getAllProds(): void {
    this.allProdSub = this._productsService.getProducts().subscribe({
      next: (response) => {
        this.allProds = response.data;
        console.log(this.allProds);
        this.productsLoaded = true;
      },
      error: (error) => console.log(error),
      complete: () => console.log('Completed'),
    });
  }

  // wishlist
  addToWishlist(productId: string): void {
    this._wishlistService.addToWishlist(productId);
  }

  removeFromWishlist(productId: string): void {
    this._wishlistService.removeFromWishlist(productId);
  }

  toggleWishlist(prodId: string) {
    const index = this.wishlist.indexOf(prodId);
    if (index === -1) {
      // Not in wishlist -> add it
      this.wishlist.push(prodId);
      this.addToWishlist(prodId);
    } else {
      // Already in wishlist -> remove it
      this.wishlist.splice(index, 1);
      this.removeFromWishlist(prodId);
    }
  }

  isInWishlist(prodId: string): boolean {
    return this.wishlist.includes(prodId);
  }

  // cart
  addToCart(productId: string): void {
    if(this.isInWishlist(productId)){
      this._wishlistService.removeFromWishlist(productId)
      this.toggleWishlist(productId)
    }
    this._cartService.addToCart(productId);
  }

  removeFromCart(productId: string): void {
    this._cartService.removeFromCart(productId);
  }

  toggleCart(prodId: string) {
    const index = this.cart.indexOf(prodId);
    if (index === -1) {
      // Not in cart -> add it
      this.cart.push(prodId);
      this.addToCart(prodId);
    } else {
      // Already in cart -> remove it
      this.cart.splice(index, 1);
      this.removeFromCart(prodId);
    }
  }

  isInCart(prodId: string): boolean {
    return this.cart.includes(prodId);
  }

  ngOnDestroy(): void {
    console.log('🧹 Prod Component destroyed');
    if (this.allProdSub) {
      this.allProdSub.unsubscribe();
      console.log('✅ Unsubscribed Prod');
    }
  }
}
