import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Categoria } from '../../core/models/categoria.model';
import { Producto } from '../../core/models/producto.model';
import { ProductosStore } from './productos.store';

const papas: Categoria = { id: 1, nombre: 'Papas fritas' };
const bebidas: Categoria = { id: 4, nombre: 'Bebidas' };

const papasChicas: Producto = { id: 10, nombre: 'Papas chicas', precio: 2500, disponible: true, categoriaId: 1 };
const bebida: Producto = { id: 11, nombre: 'Bebida 500 cc', precio: 1200, disponible: true, categoriaId: 4 };

describe('ProductosStore', () => {
  let store: ProductosStore;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    store = TestBed.inject(ProductosStore);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function cargarDatos(): void {
    store.cargar();
    http.expectOne('/api/productos').flush([papasChicas, bebida]);
    http.expectOne('/api/categorias').flush([papas, bebidas]);
  }

  it('carga productos y categorías', () => {
    store.cargar();
    expect(store.cargando()).toBe(true);

    http.expectOne('/api/productos').flush([papasChicas, bebida]);
    http.expectOne('/api/categorias').flush([papas, bebidas]);

    expect(store.productos().length).toBe(2);
    expect(store.categorias().length).toBe(2);
    expect(store.cargando()).toBe(false);
  });

  it('cuenta los productos de cada categoría', () => {
    cargarDatos();
    expect(store.conteoPorCategoria()).toEqual({ 1: 1, 4: 1 });
  });

  it('al elegir una categoría muestra solo sus productos', () => {
    cargarDatos();

    store.seleccionarCategoria(4);

    expect(store.productosVisibles()).toEqual([bebida]);
    store.seleccionarCategoria(null);
    expect(store.productosVisibles().length).toBe(2);
  });

  it('guarda un producto con POST y recarga la lista', () => {
    cargarDatos();
    let terminado = false;

    store.crearProducto({ nombre: 'Sopaipilla', precio: 800, categoriaId: 3 }).subscribe(() => (terminado = true));

    const peticion = http.expectOne('/api/productos');
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body).toEqual({ nombre: 'Sopaipilla', precio: 800, categoriaId: 3 });
    peticion.flush({ id: 12, nombre: 'Sopaipilla', precio: 800, disponible: true, categoriaId: 3 });

    http.expectOne('/api/productos').flush([papasChicas, bebida]);
    http.expectOne('/api/categorias').flush([papas, bebidas]);

    expect(terminado).toBe(true);
  });

  it('si el servidor rechaza el guardado, no emite y muestra el error', () => {
    cargarDatos();
    let terminado = false;

    store.crearProducto({ nombre: 'Fantasma', precio: 100, categoriaId: 999 }).subscribe(() => (terminado = true));

    http.expectOne('/api/productos').flush({ detail: 'error' }, { status: 500, statusText: 'Server Error' });

    expect(terminado).toBe(false);
  });
});
