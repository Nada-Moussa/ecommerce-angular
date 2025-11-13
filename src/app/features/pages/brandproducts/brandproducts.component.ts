import { Component } from '@angular/core';
import { Products } from '../../interfaces/products';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-brandproducts',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './brandproducts.component.html',
  styleUrl: './brandproducts.component.css',
})
export class BrandproductsComponent implements OnInit, OnDestroy {
  prodSub: any;
  allProds: Products[] = [];
  filteredProds: Products[] = [];
  brandId!: string | null;
  brandName!: string | null;

  wishlist: string[] = []; // holds product ids for products added to wishlist
  cart: string[] = []; // holds product ids for products added to cart

  prodsLoaded: boolean = false;

  constructor(
    private _productsService: ProductsService,
    private _activatedRoute: ActivatedRoute, 
    private _router: Router,
    private _wishlistService: WishlistService,
    private _cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.brandId = this._activatedRoute.snapshot.paramMap.get('id');
    this.brandName = this._activatedRoute.snapshot.paramMap.get('name');
    this.getProds();
    this._wishlistService.loadWishlist(this.wishlist);
    this._cartService.loadCart(this.cart);
  }

  getProds(): void {
    this.prodSub = this._productsService.getProducts().subscribe({
      next: (response) => {
        this.allProds = response.data;
        this.filterProds();
        this.prodsLoaded = true;
      },
      error: (error) => console.log(error),
      complete: () => console.log('Completed'),
    });
  }

  prodDetails(prodId: string): void {
    this._router.navigate(['products/product_details', prodId]);
  }

  filterProds(): void {
    if (this.brandId) {
      this.filteredProds = this.allProds.filter(
        (item) => item.brand._id === this.brandId
      );
    } else return;

    if (this.filteredProds.length > 0) {
      console.log(this.filteredProds);
    } else {
      console.log('There are no products');
    }
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
    console.log('🧹 SubProd Component destroyed');
    if (this.prodSub) {
      this.prodSub.unsubscribe();
      console.log('✅ Unsubscribed SubProd');
    }
  }
}
