import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from '../../services/address.service';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../services/order.service';
import { OnInit, OnDestroy } from '@angular/core';
import { Orders } from '../../interfaces/orders';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit, OnDestroy {
  userData: any;
  userSub: any;
  ordersSub: any;

  ordersList: Orders[] = [];

  ordersLoaded: boolean = false;

  constructor(
    private _authService: AuthService,
    private _addressService: AddressService,
    private _orderService: OrderService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserOrders(userId: string): void {
    this.ordersSub = this._orderService.getUserOrders(userId).subscribe({
      next: (response) => {
        this.ordersList = response;
        console.log(this.ordersList); 
        this.ordersLoaded = true;
      },
      error: (error) => console.log(error),

      complete: () => console.log('Completed'),
    });
  }

  getUserDetails(): void {
    this.userSub = this._authService.getUserById().subscribe({
      next: (response) => {
        console.log('User details:', response.data);
        this.userData = response.data;
        console.log(this.userData);
        this.getUserOrders(this.userData._id);
      },
      error: (error) => console.log(error),

      complete: () => console.log('Completed'),
    });
  }

  ngOnDestroy(): void {}
}
