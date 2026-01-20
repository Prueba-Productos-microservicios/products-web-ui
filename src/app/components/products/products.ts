import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductsService, Product, CreateProductDto } from '../../services/products.service';

@Component({
  selector: 'app-products',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  products$!: Observable<Product[]>;
  productForm: FormGroup;
  isCreating = false;

  constructor(private productsService: ProductsService) {
    this.productForm = new FormGroup({
      name: new FormControl('', Validators.required),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      stock: new FormControl(0, [Validators.required, Validators.min(0)])
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.products$ = this.productsService.getProducts().pipe(
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
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error creating product', err);
          this.isCreating = false;
        }
      });
    }
  }

  deleteProduct(id: number): void {
    this.productsService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err) => console.error('Error deleting product', err)
    });
  }
}
