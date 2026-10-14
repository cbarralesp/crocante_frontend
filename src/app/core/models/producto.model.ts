/** Producto tal como lo entrega la API (GET /api/productos). */
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  disponible: boolean;
  categoriaId: number;
}

/** Datos que se envían para guardar un producto (POST /api/productos). El id lo asigna el servidor. */
export interface ProductoRequest {
  nombre: string;
  precio: number;
  categoriaId: number;
}
