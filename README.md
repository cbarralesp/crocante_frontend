# crocante_frontend

Pantalla Angular 21 del sistema de venta de comida rápida **Crocante**. Lista los productos por categoría y permite guardar productos nuevos. Se conecta al backend https://github.com/cbarralesp/crocante_backend (Spring Boot, puerto 8080).

## Requisitos

- Node.js LTS (22 o superior) y npm.
- El backend `crocante_backend` en ejecución en `http://localhost:8080` (ver su README, desde el `paso-05`).

## Levantar en local

```bash
npm install        # solo la primera vez
npm start
```

Abrir http://localhost:4200. Arriba a la derecha debe poder pulsarse **Nuevo producto**, y a la izquierda deben verse las categorías cargadas desde la base de datos.

## Cómo se conecta al backend

`proxy.conf.json` reenvía todo lo que empieza con `/api` hacia `http://localhost:8080`. Así el navegador habla solo con el puerto 4200 y no hace falta configurar CORS. Si el backend usa otro puerto, cambia el `target` de ese archivo y reinicia `npm start`.

| Pantalla | Llamada HTTP |
|---|---|
| Cargar la lista | `GET /api/productos` |
| Cargar las categorías | `GET /api/categorias` |
| Guardar un producto | `POST /api/productos` |

## Estructura

```
src/app
├── core/          modelos, servicios HTTP (api) e interceptor de errores
├── shared/ui/     modal, avisos (toast) y formato de pesos (CLP)
└── features/productos
    ├── productos.store.ts     estado de la pantalla (signals)
    ├── productos.page.*       componente contenedor
    └── components/            tabla, panel de categorías y formulario
```

Los componentes de `components/` solo reciben datos y emiten eventos. Solo la página conoce al store, y solo el store conoce a los servicios HTTP.

## Pruebas y compilación

```bash
npm test -- --watch=false
npm run build
```
