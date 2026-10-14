import { Component, input, output } from '@angular/core';

import { Categoria } from '../../../../core/models/categoria.model';

/** Componente de presentación: recibe datos por input() y avisa por output(). */
@Component({
  selector: 'app-categoria-panel',
  templateUrl: './categoria-panel.html',
})
export class CategoriaPanel {
  readonly categorias = input.required<Categoria[]>();
  /** Cantidad de productos por categoría: { [categoriaId]: cantidad }. */
  readonly conteos = input.required<Partial<Record<number, number>>>();
  readonly total = input.required<number>();
  readonly activa = input<number | null>(null);

  readonly seleccionar = output<number | null>();
}
