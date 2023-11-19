import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  nameUser:string,
  _id: string;
  productId: string;
  quanlity: number;
  shippingAddress: string;
  productName:string;
  paymentMethod:string;
  // Thêm các trường thông tin khác của đơn hàng nếu cần
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private API = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  createOrder(orderData: any): Observable<Order> {
    return this.http.post<Order>(`${this.API}/orders`, orderData);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API}/orders`);
  }

  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.API}/orders/${orderId}`);
  }

  updateOrder(orderId: string, updatedOrderData: any): Observable<Order> {
    return this.http.patch<Order>(`${this.API}/orders/${orderId}`, updatedOrderData);
  }

  deleteOrder(orderId: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/orders/${orderId}`);
  }
}
