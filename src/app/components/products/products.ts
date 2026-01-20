import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ProductsService, Product, CreateProductDto } from '../../services/products.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
  standalone: true
})
export class Products implements OnInit {
  products$!: Observable<Product[]>;
  productForm: FormGroup;
  isCreating = false;
  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;

  constructor(
    private productsService: ProductsService,
    private toastr: ToastrService
  ) {
    this.productForm = new FormGroup({
      name: new FormControl('', Validators.required),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      stock: new FormControl(0, [Validators.required, Validators.min(0)])
    });
  }

  ngOnInit(): void {
    this.loadProducts(1);
  }

  loadProducts(page: number): void {
    this.currentPage = page;
    this.products$ = this.productsService.getProducts(page).pipe(
      tap(res => {
        this.totalPages = res.pageInfo.lastPage;
        this.totalItems = res.pageInfo.total;
        this.currentPage = res.pageInfo.page;
      }),
      map(res => res.data)
    );
  }

  createProduct(): void {
    if (this.productForm.valid) {
      this.isCreating = true;
      this.productsService.createProduct(this.productForm.value).subscribe({
        next: (product) => {
          this.productForm.reset();
          this.isCreating = false;
          this.toastr.success('Producto creado');
          this.loadProducts(this.currentPage);
        },
        error: (err) => {
          console.error('Error ', err);
          this.isCreating = false;
          this.toastr.error('Error al crear el producto');
        }
      });
    }
  }

  deleteProduct(id: number): void {
    this.productsService.deleteProduct(id).subscribe({
      next: () => {
        this.toastr.success('Producto eliminado');
        this.loadProducts(this.currentPage);
      },
      error: (err) => {
        console.error('Error', err);
        this.toastr.error('Error al eliminar el producto');
      }
    });
  }

  prevPage() { 
    if (this.currentPage > 1) { 
      this.loadProducts(this.currentPage - 1); 
    } 
  }

  nextPage() { 
    if (this.currentPage < this.totalPages) { 
      this.loadProducts(this.currentPage + 1); 
    } 
  }

  goToPage(page: number) { 
    this.loadProducts(page); 
  }

  getPages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
