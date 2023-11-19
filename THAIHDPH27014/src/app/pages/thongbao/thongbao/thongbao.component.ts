import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-thongbao',
  templateUrl: './thongbao.component.html',
  styleUrls: ['./thongbao.component.css']
})
export class ThongbaoComponent implements OnInit {
  paymentMethod: string = '';
  product: any = {};
  constructor(private route:ActivatedRoute,private productService:ProductService)  { }

  ngOnInit(): void {
    // Nhận thông tin từ queryParams
    this.route.queryParams.subscribe((params) => {
      this.paymentMethod = params['paymentMethod'] || 'Unknown Payment Method';
      
      // Lấy thông tin sản phẩm từ queryParams
      const productId = params['productId'];
      if (productId) {
        this.productService.getOneProduct(productId).subscribe((data) => {
          this.product = data;
        });
      }
    });
  }}
  

