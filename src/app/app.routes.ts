import { Routes } from '@angular/router';
import { Products } from './components/products/products';

export const routes: Routes = [
  { path: '', component: Products },
  { path: '**', redirectTo: '' }
];
