import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { OnInit, OnDestroy } from '@angular/core';
import { Brands } from '../../interfaces/products';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})

export class BrandsComponent implements OnInit, OnDestroy{

  allBrandSub: any;
  allBrands: Brands[] = [];
  brandsLoaded: boolean = false;

  constructor(private _productsService:ProductsService, private _router:Router) {}

  ngOnInit(): void {
    this.getAllBrands();
  }

  getAllBrands(): void {
    this.allBrandSub = this._productsService.getBrands().subscribe({
      next: (response) => {
        this.allBrands = response.data;
        console.log(this.allBrands);
        this.brandsLoaded = true;
      }, 
      error: (error) => console.log(error),
      complete: () => console.log('Completed'), 
    });
  }

  goToBrandProds(brandId: string, brandName: string): void {
    this._router.navigate(['products/brands', brandId, brandName]);
  }

  ngOnDestroy(): void {
    console.log('🧹 Brand Component destroyed');
    if (this.allBrandSub) {
      this.allBrandSub.unsubscribe();
      console.log('✅ Unsubscribed Brand');
    }
  }
  
}
