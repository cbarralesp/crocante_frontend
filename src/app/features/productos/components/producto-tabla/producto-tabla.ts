import { Component, input } from '@angular/core';

import { Categoria } from '../../../../core/models/categoria.model';
import { Producto } from '../../../../core/models/producto.model';
import { ClpPipe } from '../../../../shared/ui/clp.pipe';

@Component({
  selector: 'app-producto-tabla',
  imports: [ClpPipe],
  templateUrl: './producto-tabla.html',
})
export class ProductoTabla {
  readonly productos = input.required<Producto[]>();
  readonly categorias = input.required<Categoria[]>();

  protected nombreCategoria(id: number): string {
    return this.categorias().find((categoria) => categoria.id === id)?.nombre ?? 'Sin categoría';
  }

  protected inicial(producto: Producto): string {
    return producto.nombre.trim().charAt(0).toUpperCase();
  }
}
