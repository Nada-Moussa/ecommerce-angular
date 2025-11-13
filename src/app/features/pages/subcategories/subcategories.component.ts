import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { SubCategory } from '../../interfaces/products';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-subcategories',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './subcategories.component.html',
  styleUrl: './subcategories.component.css',
})
export class SubcategoriesComponent implements OnInit, OnDestroy {
  
  subCatSub: any;
  subCats: SubCategory[] = [];
  catId!: string | null;
  catName!: string | null;
  
  subCatsLoaded: boolean = false;

  constructor(
    private _productsService: ProductsService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.catId = this._activatedRoute.snapshot.paramMap.get('id');
    this.catName = this._activatedRoute.snapshot.paramMap.get('name');
    this.getSubCats(this.catId as string);
  }

  getSubCats(catId: string): void {
    this.subCatSub = this._productsService.getCatSubCats(catId).subscribe({
      next: (response) => {
        console.log(response.data);
        this.subCats = response.data;
        this.subCatsLoaded = true;

      },
      error: (error) => console.log(error),
      complete: () => console.log('Completed'),
    });
  }

  goToSubCatProds(subCatId: string, subCatName: string): void {
    this._router.navigate(['products/subcategories', subCatId, subCatName]);
  }

  ngOnDestroy(): void {
    console.log('🧹 SubCat Component destroyed');
    if(this.subCatSub) {
      this.subCatSub.unsubscribe();
      console.log('✅ Unsubscribed SubCat');
    }
  }
}
