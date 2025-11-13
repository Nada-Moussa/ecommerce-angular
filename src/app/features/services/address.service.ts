import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from '../interfaces/address';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  addressUrl: string = 'https://ecommerce.routemisr.com/api/v1/addresses';

  constructor(private _httpClient: HttpClient) {}

  postAddress(address: Address): Observable<any> {
    return this._httpClient.post(this.addressUrl, address)
  }

  getAddresses(): Observable<any> {
    return this._httpClient.get(this.addressUrl);
  }

  getSpecificAdd(addId: string): Observable<any> {
    return this._httpClient.get(`${this.addressUrl}/${addId}`);
  }

  deleteAddress(addId: string): Observable<any> {
     return this._httpClient.delete(`${this.addressUrl}/${addId}`);
  }
}
