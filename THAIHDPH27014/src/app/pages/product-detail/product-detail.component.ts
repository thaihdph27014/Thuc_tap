import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IProduct } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
[x: string]: any;
  product: IProduct = {} as IProduct;
  user: any;
  showFullDescription: boolean = false; // Trạng thái mô tả, ban đầu thu gọn
  isLoggedIn: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private productService: ProductService
  ) {};
  logout() {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login')
  }
  ngOnInit() {
    
    this.route.paramMap.subscribe((params) => {
      const productId = String(params.get('id'));
      const products = this.productService.getOneProduct(productId).subscribe(data => {
        this.product = data
      })
      
    });
    this.user = JSON.parse(String(localStorage.getItem('user')));
    if (this.user) {
      this.isLoggedIn = true;
    }
  }
  redirectToOrderPage(productId: string): void {
    // Kiểm tra nếu người dùng đã đăng nhập, cho phép đặt hàng
    if (this.isLoggedIn) {
      // Thực hiện chuyển hướng đến trang đặt hàng với productId
      this.router.navigate(['/order', productId]);
    } else {
      // Người dùng chưa đăng nhập, hiển thị thông báo cảnh báo
      alert('Vui lòng đăng nhập để đặt hàng.');
      this.router.navigate(['/login']);
    }
  }


  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }
}
