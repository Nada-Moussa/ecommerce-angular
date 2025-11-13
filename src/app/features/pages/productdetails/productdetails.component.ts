import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { OnInit, OnDestroy } from '@angular/core';
import { Products } from '../../interfaces/products';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../interfaces/cart';
import { WishlistService } from '../../services/wishlist.service';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-productdetails',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './productdetails.component.html',
  styleUrl: './productdetails.component.css',
})
export class ProductdetailsComponent implements OnInit, OnDestroy {
  prodDetailSub: any;
  prod!: Products;
  prodId!: string | null;
  quantity: number = 0;
  cartSub: any;
  cart: any[] = []; // holds product in cart
  cartItem?: CartItem;
  wishlist: string[] = []; // holds product ids for products added to wishlist

  prodsLoaded: boolean = false; 
  cartDataLoaded: boolean = false; 

  isAddingToCart: boolean = false;
  isUpdatingCart: boolean = false;
  isRemovingFromCart: boolean = false;
  isAddingToWishlist: boolean = false;
  isRemovingFromWishlist: boolean = false;

  constructor(
    private _productsService: ProductsService,
    private _cartService: CartService,
    private _activatedRoute: ActivatedRoute,
    private _wishlistService: WishlistService,
  ) {}

  ngOnInit(): void {
    this.prodId = this._activatedRoute.snapshot.paramMap.get('id');
    this.getProdDetails(this.prodId as string);
    this.loadCartAndSetQuantity(this.prodId as string);
    this._wishlistService.loadWishlist(this.wishlist);
  }

  getProdDetails(prodId: string): void {
    this.prodDetailSub = this._productsService
      .getProdDetails(prodId)
      .subscribe({
        next: (response) => {
          this.prod = response.data;
          console.log(this.prod);
          this.prodsLoaded = true;
        },
        error: (error) => console.log(error),
        complete: () => console.log('Completed'),
      });
  }

  loadCartAndSetQuantity(prodId: string): void {
    this.cartSub = this._cartService.getCart().subscribe({
      next: (response) => {
        this.cart = response.data.products;
        this.cartItem = this.cart.find(
          (item: any) => item.product.id === prodId
        );
        console.log('Cart Item', this.cartItem);
        this.cartDataLoaded = true;
        
        if (this.cartItem) {
          this.quantity = this.cartItem.count;
        } else {
          this.quantity = 0;
        }
      },
      error: (error) => console.log(error),
    });
  }

  isInCart(): boolean {
    if (this.cartItem) {
      return true;
    } else return false;
  }


  updateItemQuantity(productId: string, count: number): void {
    console.log(count);
    if (!this.isInCart()) {
      console.log('not in cart');
      this.addToCart(productId, count);
      return;
    } else if (count < 1) {
      // if user removes last item - remove the item itself from cart
      this.removeFromCart(productId);
      return;
    }

    console.log('update');
    this.isUpdatingCart = true;
    this.cartSub = this._cartService
      .updateItemQuantity(productId, count)
      .subscribe({
        next: (response) => {
          console.log(response.data);
          this.loadCartAndSetQuantity(productId);
          this.isUpdatingCart = false;
        },
        error: (error) => {
          console.log(error);
          this.isUpdatingCart = false;
        },
        complete: () => console.log('Completed'),
      });
  }

  addToCart(productId: string, count: number): void {
    this.isAddingToCart = true;
    console.log(productId);
    if(this.isInWishlist(productId)) {
      this._wishlistService.deleteFromWishlist(productId).subscribe({
        next: () => {
          this.wishlist = this.wishlist.filter((id) => id !== productId);
        },
      });
    }
    this.cartSub = this._cartService.postCart(productId).subscribe({
      next: (response) => {
        console.log(response);
        if (count > 1) {
          this.cartSub = this._cartService
            .updateItemQuantity(productId, count)
            .subscribe({
              next: (response) => {
                console.log(response.data);
                this.loadCartAndSetQuantity(productId);
                this.isAddingToCart = false;
              },
              error: (error) => {
                console.log(error);
              this.isAddingToCart = false;
            },
              complete: () => console.log('Completed'),
            });
        }
        else {
            this.loadCartAndSetQuantity(productId);
            this.isAddingToCart = false;
        }
      },
      error: (error) => {
        console.log(error);
      this.isAddingToCart = false;
    },
      complete: () => console.log('Completed'),
    });
  }

  removeFromCart(productId: string): void {
    this.isRemovingFromCart = true;
    this.cartSub = this._cartService.deleteFromCart(productId).subscribe({
      next: (response) => {
        console.log('Removed from cart:', response);
        this.loadCartAndSetQuantity(productId);
        this.isRemovingFromCart = false;
      },
      error: (error) => {
        console.log(error);
      this.isRemovingFromCart = false;},
      complete: () => console.log('Completed'),
    });
  }

  updateQuantity(num: number): void {
    this.quantity = num;
  }

  isInWishlist(prodId: string): boolean {
    return this.wishlist.includes(prodId);
  }

  addToWishlist(productId: string): void {
    this.isAddingToWishlist = true;
    this._wishlistService.addToWishlist(productId);
    this.wishlist.push(productId);
    // Simulate delay for UI feedback
    setTimeout(() => {
      this.isAddingToWishlist = false;
    }, 300);
  }

  removeFromWishlist(productId: string): void {
    this.isRemovingFromWishlist = true;
    this._wishlistService.removeFromWishlist(productId);
    this.wishlist = this.wishlist.filter(id => id !== productId);
    // Simulate delay for UI feedback
    setTimeout(() => {
      this.isRemovingFromWishlist = false;
    }, 300);
  }

  ngOnDestroy(): void {
    console.log('🧹 ProdDetail Component destroyed');
    if (this.prodDetailSub) {
      this.prodDetailSub.unsubscribe();
      console.log('✅ Unsubscribed ProdDetail');
    }
    if (this.cartSub) {
      this.cartSub.unsubscribe();
      console.log('✅ Unsubscribed Cart');
    }
  }
}
