import { Injectable, computed, inject, signal } from '@angular/core';
import { EMPTY, Observable, finalize, forkJoin, map, switchMap, tap, catchError } from 'rxjs';

import { CategoriaApi } from '../../core/api/categoria.api';
import { ProductoApi } from '../../core/api/producto.api';
import { ApiError } from '../../core/models/api-error';
import { Categoria } from '../../core/models/categoria.model';
import { Producto, ProductoRequest } from '../../core/models/producto.model';
import { ToastService } from '../../shared/ui/toast.service';

/**
 * Estado de la pantalla (patrón Store/Facade con signals).
 * Los componentes leen signals y llaman a métodos; nunca hablan con la API directamente.
 */
@Injectable({ providedIn: 'root' })
export class ProductosStore {
  private readonly productoApi = inject(ProductoApi);
  private readonly categoriaApi = inject(CategoriaApi);
  private readonly toast = inject(ToastService);

  /** Todos los productos que hay en el servidor. */
  readonly productos = signal<Producto[]>([]);
  readonly categorias = signal<Categoria[]>([]);
  readonly categoriaActiva = signal<number | null>(null);
  readonly cargando = signal(false);

  /** Los productos que se ven en la tabla según la categoría elegida. */
  readonly productosVisibles = computed(() => {
    const activa = this.categoriaActiva();
    return activa === null ? this.productos() : this.productos().filter((p) => p.categoriaId === activa);
  });

  /** Cuántos productos tiene cada categoría: { [categoriaId]: cantidad }. */
  readonly conteoPorCategoria = computed(() => {
    const conteo: Record<number, number> = {};
    for (const producto of this.productos()) {
      conteo[producto.categoriaId] = (conteo[producto.categoriaId] ?? 0) + 1;
    }
    return conteo;
  });

  cargar(): void {
    this.cargando.set(true);
    this.refrescar()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({ error: (e: ApiError) => this.toast.error(e.message) });
  }

  seleccionarCategoria(id: number | null): void {
    this.categoriaActiva.set(id);
  }

  /**
   * Devuelve un Observable que emite solo si el guardado salió bien;
   * así la pantalla cierra el formulario únicamente en caso de éxito.
   */
  crearProducto(request: ProductoRequest): Observable<void> {
    return this.productoApi.crear(request).pipe(
      switchMap(() => this.refrescar()),
      tap(() => this.toast.exito('Producto guardado')),
      catchError(this.fallar),
    );
  }

  /** Recarga productos y categorías en paralelo. */
  private refrescar(): Observable<void> {
    return forkJoin({
      productos: this.productoApi.listar(),
      categorias: this.categoriaApi.listar(),
    }).pipe(
      tap(({ productos, categorias }) => {
        this.productos.set(productos);
        this.categorias.set(categorias);
      }),
      map(() => undefined),
    );
  }

  /** Muestra el error y corta el flujo: el Observable termina sin emitir. */
  private readonly fallar = (error: ApiError): Observable<never> => {
    this.toast.error(error.message);
    return EMPTY;
  };
}
