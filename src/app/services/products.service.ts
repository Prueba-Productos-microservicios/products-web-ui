import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

export interface Page {
  total: number;
  page: number;
  lastPage: number;
}

export interface PaginatedResponse {
  data: Product[];
  pageInfo: Page;
}

export interface CreateProductDto {
  name: string;
  price: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<PaginatedResponse> {
    return this.http.get<PaginatedResponse>(this.apiUrl);
  }

  createProduct(product: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  deleteProduct(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}