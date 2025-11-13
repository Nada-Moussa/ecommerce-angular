import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Cart, CartItem } from '../../interfaces/cart';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AddressService } from '../../services/address.service';
import { OnInit, OnDestroy } from '@angular/core';
import { orderAddress, shippingAddress } from '../../interfaces/orders';
import { Address } from '../../interfaces/address';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartSub: any;
  orderSub: any;
  addressSub: any;

  addressList: Address[] = [];
  selectedAddressId!: string;
  selectedAddress!: any;
  shippingAddress!: orderAddress;
  paymentMethod: 'cash' | 'online' = 'cash';

  cartOwner!: string;
  cartItems: CartItem[] = [];
  cart: Cart = {
    _id: '',
    cartOwner: '',
    products: [],
    totalCartPrice: 0,
  };

  addressesLoaded: boolean = false;
  orderLoaded: boolean = false;

  constructor(
    private _cartService: CartService,
    private _orderService: OrderService,
    private _addressService: AddressService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.getCart();
    this.getAddresses();
  }

  getCart(): void {
    this.cartSub = this._cartService.getCart().subscribe({
      next: (response) => {
        this.cart = response.data;
        console.log(this.cart);
        this.cartOwner = response.data.cartOwner;
        console.log(this.cartOwner);
        this.cartItems = this.cart.products;
        console.log(this.cartItems);
        this.orderLoaded = true;
      },
      error: (error) => console.log(error),
      complete: () => console.log('Completed'),
    });
  }

  getAddresses(): void {
    this.addressSub = this._addressService.getAddresses().subscribe({
      next: (response) => {
        this.addressList = response.data;
        console.log(this.addressList);
        if (this.addressList.length > 0) {
          this.selectedAddressId = this.addressList[0]._id;
        }
        this.addressesLoaded = true;
      },
      error: (error) => console.log(error),
      complete: () => console.log('Completed'),
    });
  }

  backToCart(): void {
    this._router.navigate(['cart']);
  }

  addAddress(): void {
    this._router.navigate(['profile']);
  }

  confirmOrder(userId: string, address: orderAddress): void {
    this.selectedAddress = this.addressList.find(
      (a) => a._id === this.selectedAddressId
    );
    if (!this.selectedAddress) {
      alert('Please select a shipping address.');
      return;
    }

    this.shippingAddress = {
      shippingAddress: {
        details: this.selectedAddress.details,
        phone: this.selectedAddress.phone,
        city: this.selectedAddress.city,
      },
    };

    if (this.paymentMethod === 'cash') {
      this.orderSub = this._orderService
        .createCashOrder(userId, this.shippingAddress)
        .subscribe({
          next: (response) => {
            console.log('Cash Order:', response.data);
            this._router.navigate(['allorders']);
          },
          error: (error) => console.log(error),
          complete: () => console.log('Completed'),
        });
    } else {
      this.orderSub = this._orderService
        .createCheckoutSession(userId, this.shippingAddress)
        .subscribe({
          next: (response) => {
            console.log('Checkout Session:', response);
            if (response.session?.url) {
              window.location.href = response.session.url; // redirect to Stripe checkout
            }
          },
          error: (error) => console.log(error),
          complete: () => console.log('Completed'),
        });
    }
  }

  ngOnDestroy(): void {
    if (this.cartSub) this.cartSub.unsubscribe();
    if (this.orderSub) this.orderSub.unsubscribe();
    if (this.addressSub) this.addressSub.unsubscribe();
  }
}
