import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from 'src/app/common/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

constructor(private htpp: HttpClient) { }
 private API = 'http://localhost:8080/api/products';
 private API1 = 'http://localhost:8080/api/categories';
 private API2 = 'http://localhost:8080/api';
 getAllProduct(): Observable<any[]> {
  return this.htpp.get<any[]>(this.API)
 }
 getOneProduct(id: string | number): Observable<any> {
  return this.htpp.get<any>(`${this.API}/${id}`)
 }
 addProduct(product: any): Observable<IProduct> {
  return this.htpp.post<IProduct>(`${this.API}`, product)
 }
 updateProduct(product: any, id: string | number): Observable<IProduct> {
  return this.htpp.put<IProduct>(`${this.API}/${id}`, product)
 }
 deleteProduct(id: string | number): Observable<IProduct> {
  return this.htpp.delete<IProduct>(`${this.API}/${id}`)
 }

 getProductsByCategory(categoryId: string): Observable<IProduct[]> {
  const url = `${this.API2}/products/category/${categoryId}`;
  return this.htpp.get<IProduct[]>(url);
}
}
