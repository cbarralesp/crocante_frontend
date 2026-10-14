import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Categoria } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaApi {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/categorias';

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.base);
  }
}
