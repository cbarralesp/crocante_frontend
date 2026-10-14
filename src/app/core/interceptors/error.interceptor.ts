import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { ApiError } from '../models/api-error';

interface ProblemaHttp {
  detail?: string;
  errores?: Record<string, string>;
}

/** Convierte cualquier error HTTP en un ApiError con un mensaje legible. */
export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: HttpErrorResponse) =>
      throwError(() => new ApiError(mensajeDe(error), error.status)),
    ),
  );

function mensajeDe(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'No hay conexión con el servidor';
  }
  const problema = error.error as ProblemaHttp | null;
  if (problema?.errores) {
    return Object.values(problema.errores).join('. ');
  }
  return problema?.detail ?? 'Ocurrió un error inesperado';
}
