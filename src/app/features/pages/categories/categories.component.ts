import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { OnInit, OnDestroy } from '@angular/core';
import { Category } from '../../interfaces/products';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})

export class CategoriesComponent implements OnInit, OnDestroy {

  allCatSub: any; 
  allCats: Category[] = [];
  catsLoaded: boolean = false; 
  
  constructor(private _productsService: ProductsService, private _router: Router) {}

  ngOnInit(): void {
    this.getAllCats();
  }

  getAllCats(): void {
    this.allCatSub = this._productsService.getCategories().subscribe({
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

  ngOnDestroy(): void {
    console.log('🧹 Cat Component destroyed');
    if(this.allCatSub) {
      this.allCatSub.unsubscribe();
      console.log('✅ Unsubscribed Cat');
    }
  }
}
