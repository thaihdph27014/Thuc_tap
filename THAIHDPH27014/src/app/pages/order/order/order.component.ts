import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from 'src/app/common/product';
import { OrderService } from 'src/app/services/order/Order.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  product: IProduct = {} as IProduct;
  order: any = {
    nameUser:'',
    productId: '',
    quanlity: 1, // Mặc định số lượng là 1
    shippingAddress: '',
    paymentMethod: ''
  };
  errorMessage: string = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const productId = String(params.get('id'));
      this.productService.getOneProduct(productId).subscribe(data => {
        this.product = data;
        // Tự động điền giá trị productId vào form
        this.order.productId = this.product._id;
      });
    });
  }

  placeOrder() {
    if (this.product.quanlity === 0) {
      alert('Hết hàng');
    } else if (this.order.quanlity > this.product.quanlity) {
      alert('Số lượng đặt hàng vượt quá số lượng có sẵn');
      this.order.quanlity = 1;
    }  else if (!this.order.quanlity) {
      alert('Vui lòng nhập số lượng.');
    } else if (!this.order.nameUser) {
      alert('Vui lòng nhập tên.');
    } else if (!this.order.shippingAddress) {
      alert('Vui lòng nhập địa chỉ.');
    } else if (!this.order.paymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán.');
    }
    else {
      this.orderService.createOrder(this.order).subscribe(
        (response) => {
          console.log('Đặt hàng thành công:', response);
          // Lấy thông tin phương thức thanh toán từ form
          const selectedPaymentMethod = this.order.paymentMethod;
          if (selectedPaymentMethod === 'vnpay') {
            // Thực hiện chuyển hướng đến trang thanh toán VNPay
            window.location.href = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'; // Thay thế URL_THANH_TOAN_VNPAY bằng URL thực tế của trang thanh toán VNPay
          }
          // Điều hướng đến trang thông báo thành công và truyền thông tin sản phẩm và phương thức thanh toán qua queryParams
          this.router.navigate(['/order-success'], {
            queryParams: {
              productId: this.product._id,
              paymentMethod: selectedPaymentMethod
            }
          });
          
          // Reset form sau khi đặt hàng thành công
          this.order = {
            nameUser: "",
            productId: this.product._id,
            quanlity: 1,
            shippingAddress: '',
            paymentMethod: 'cash',
          };
        },
        (error) => {
          console.error('Đặt hàng thất bại:', error);
          alert('Đặt hàng thất bại. Vui lòng thử lại sau.');
        }
      );
    }
  }
  
  
}
