import { Component, input, output } from '@angular/core';

/** Ventana modal reutilizable: el contenido se proyecta con <ng-content>. */
@Component({
  selector: 'app-modal',
  host: { '(document:keydown.escape)': 'cerrar.emit()' },
  template: `
    <div class="modal-fondo" (click)="cerrar.emit()">
      <div class="modal" role="dialog" aria-modal="true" [attr.aria-label]="titulo()" (click)="$event.stopPropagation()">
        <header class="modal-cabecera">
          <h2>{{ titulo() }}</h2>
          <button type="button" class="btn-icono" aria-label="Cerrar" (click)="cerrar.emit()">✕</button>
        </header>
        <div class="modal-cuerpo">
          <ng-content />
        </div>
      </div>
    </div>
  `,
})
export class Modal {
  readonly titulo = input.required<string>();
  readonly cerrar = output<void>();
}
