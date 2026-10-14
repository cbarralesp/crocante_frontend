import { Component, OnInit, inject, signal } from '@angular/core';

import { ProductoRequest } from '../../core/models/producto.model';
import { CategoriaPanel } from './components/categoria-panel/categoria-panel';
import { ProductoFormModal } from './components/producto-form-modal/producto-form-modal';
import { ProductoTabla } from './components/producto-tabla/producto-tabla';
import { ProductosStore } from './productos.store';

/**
 * Componente contenedor (smart): es el único que conoce al store.
 * Los componentes hijos solo reciben datos y emiten eventos.
 */
@Component({
  selector: 'app-productos-page',
  imports: [CategoriaPanel, ProductoTabla, ProductoFormModal],
  templateUrl: './productos.page.html',
  styleUrl: './productos.page.css',
})
export class ProductosPage implements OnInit {
  protected readonly store = inject(ProductosStore);

  protected readonly formularioAbierto = signal(false);

  ngOnInit(): void {
    this.store.cargar();
  }

  protected nuevoProducto(): void {
    this.formularioAbierto.set(true);
  }

  protected guardarProducto(request: ProductoRequest): void {
    this.store.crearProducto(request).subscribe(() => this.cerrarFormulario());
  }

  protected cerrarFormulario(): void {
    this.formularioAbierto.set(false);
  }
}
