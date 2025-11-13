import { Component } from '@angular/core';
import { Brands, Category } from '../../interfaces/products';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, LoadingComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  brandSub: any;
  allBrands: Brands[] = [];
  brandsLoaded: boolean = false;

  catSub: any;
  allCats: Category[] = [];
  catsLoaded: boolean = false;

  constructor(
    private _productsService: ProductsService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.getAllBrands();
    this.getAllCats();
  }

  getAllBrands(): void {
    this.brandSub = this._productsService.getBrands().subscribe({
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

  getAllCats(): void {
    this.catSub = this._productsService.getCategories().subscribe({
      next: (response) => {
        this.allCats = response.data;
        console.log(this.allCats);
        this.catsLoaded = true;
      },
      error: (error) => console.log(error),
      complete: () => console.log('Completed'),
    });
  }

  goToSubCat(catId: string, catName: string): void {
    this._router.navigate(['categories/subcategories', catId, catName]);
  }

  // Carousel settings
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 600,
    margin: 20,
    autoplay: true, // Enable autoplay
    autoplayTimeout: 3000, // Time between transitions (3 seconds)
    autoplayHoverPause: true, // Pause on mouse hover
    autoplaySpeed: 1000, // Speed of autoplay transition (1 second)
    responsive: {
      0: { items: 2 },
      576: { items: 3 },
      768: { items: 4 },
      992: { items: 5 },
      1200: { items: 6 },
    },
    nav: true,
    navText: ['<', '>'],
  };

  ngOnDestroy(): void {
    if (this.brandSub) this.brandSub.unsubscribe();
    if (this.catSub) this.brandSub.unsubscribe();
  }
}
