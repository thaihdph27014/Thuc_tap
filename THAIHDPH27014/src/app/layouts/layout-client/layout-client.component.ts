import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-layout-client',
  templateUrl: './layout-client.component.html',
  styleUrls: ['./layout-client.component.scss']
})
export class LayoutClientComponent {
  [x: string]: any;
  user: any
  searchByName: string = ''; // Biến để lưu từ khóa tìm kiếm theo tên
    filteredProducts: IProduct[] = [];
  minPrice: number;
  maxPrice: number;
  currentPage: number = 1; // Trang hiện tại
  itemsPerPage: number = 4; // Số sản phẩm trên mỗi trang
  constructor(private router: Router,private productService: ProductService) {
    this.filteredProducts = this.products;
    this.minPrice = 0; // Khởi tạo giá trị mặc định cho minPrice
    this.maxPrice = 100000000;
  }
  filterProducts() {
    this.filteredProducts = this.products.filter((product) => {
      const nameMatch =
        product.name &&
        product.name.toLowerCase().includes(this.searchKeyword.toLowerCase());
      const priceMatch =
        product.price !== undefined &&
        product.price >= this.minPrice &&
        product.price <= this.maxPrice;
        return nameMatch && priceMatch;
   
    
    });
  }

  searchKeyword: string = '';
  filterProductsByPrice() {
    this.filterProducts();
  }
  searchProducts() {
    if (this.searchKeyword.trim() !== '') {
      this.filterProducts();
    } else {
      this.filteredProducts = this.products;
    }
  }
  get pagedProducts(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.products.slice(startIndex, endIndex);
  }

  get pages(): number[] {
    const pageCount = Math.ceil(this.products.length / this.itemsPerPage);
    return Array(pageCount)
      .fill(0)
      .map((_, index) => index + 1);
  }
  logout() {
    localStorage.removeItem('user');
    window.location.reload();
  }
  changePage(page: number): void {
    this.currentPage = page;
  }
  cart!: any;
  products!: IProduct[];
  ngOnInit(): void {
    this.productService.getAllProduct().subscribe((data) => {
      this.products = data;
      this.filteredProducts = data;
    });
    this.user = JSON.parse(String(localStorage.getItem('user')));
  }
  addToCart(product: any) {
    // Neu trong localStorage co cart thi lay ra va gan vao bien cart khong thi gan bang 1 mang rong
    this.cart = JSON.parse(String(localStorage.getItem('cart'))) || [];

    // Neu nguoi dung chua dang nhap thi chuyen huong sang trang login
    if(!this.user) {
      alert("Vui long dang nhap!");
      this.router.navigateByUrl('/');
      return;
    }
    // Neu gio hang da co phan tu
    if(this.cart.length > 0) {
      let checkItem = false;      
      let checkUser = false;

      this.cart.forEach((cart: any, i: number) => {
        // Check xem nguoi dung dang dang nhap da co san pham nao trong gio hang hay chua
        if(this.user.user._id === cart.userId) {       
          checkUser = true; 
          // Check xem trong gio hang da co san pham do hay chua
          cart.items.forEach((item: any, j: number) => {
      
            if(item._id === product._id) {
              // Neu trong gio hang da ton tai san pham thi cap nhap so luon len 1
              checkItem = true;
              item.quantity  += 1;
              this.cart[i].items[j] = item;
            }   
          
          })
          // Khong thi push san pham vao id nguoi dung tuong ung
          if(!checkItem) {
            this.cart[i].items.push({...product, quantity: 1})
          }
          
        }
      });
      if(!checkUser) {
        this.cart.push({
          userId: this.user.user._id,
          items: [{...product, quantity: 1}]
        })
      }
      localStorage.setItem('cart', JSON.stringify(this.cart))  
    } else {
      // Gio hang khong co phan tu nao thi push san pham vao gio hang
      this.cart.push({
        userId: this.user.user._id,
        items: [{...product, quantity: 1}]
    
      })
    
      localStorage.setItem('cart', JSON.stringify(this.cart))
     
    }
    alert("OK để thêm vào giỏ hàng")
  }
}
