import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  productsBaseUrl: string = 'https://ecommerce.routemisr.com/api/v1/products';

  categoriesBaseUrl: string =
    'https://ecommerce.routemisr.com/api/v1/categories';

  subcatsBaseUrl: string =
    'https://ecommerce.routemisr.com/api/v1/subcategories';

  brandsBaseUrl: string = 'https://ecommerce.routemisr.com/api/v1/brands';

  constructor(private _httpClient: HttpClient) {}

  getProducts(): Observable<any> {
    return this._httpClient.get(this.productsBaseUrl);
  }

  getProdDetails(prodId: string): Observable<any> {
    return this._httpClient.get(`${this.productsBaseUrl}/${prodId}`);
  }

  getCategories(): Observable<any> {
    return this._httpClient.get(this.categoriesBaseUrl);
  }

  getSubCats(): Observable<any> {
    return this._httpClient.get(this.subcatsBaseUrl);
  }

  getCatSubCats(catId: string): Observable<any> {
    return this._httpClient.get(`${this.categoriesBaseUrl}/${catId}/subcategories`)
  }

  getBrands(): Observable<any> {
    return this._httpClient.get(this.brandsBaseUrl);
  }
}
