import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Producto, ProductoRequest } from '../models/producto.model';

/** Adaptador entre la API HTTP del backend y los métodos que entiende la pantalla. */
@Injectable({ providedIn: 'root' })
export class ProductoApi {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/productos';

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.base);
  }

  crear(request: ProductoRequest): Observable<Producto> {
    return this.http.post<Producto>(this.base, request);
  }
}
