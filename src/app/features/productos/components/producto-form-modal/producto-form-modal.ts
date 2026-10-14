import { Component, OnInit, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Categoria } from '../../../../core/models/categoria.model';
import { ProductoRequest } from '../../../../core/models/producto.model';
import { Modal } from '../../../../shared/ui/modal';

/** Formulario reactivo para guardar un producto. Las reglas básicas también existen en la base de datos. */
@Component({
  selector: 'app-producto-form-modal',
  imports: [ReactiveFormsModule, Modal],
  templateUrl: './producto-form-modal.html',
})
export class ProductoFormModal implements OnInit {
  readonly categorias = input.required<Categoria[]>();
  readonly categoriaInicial = input<number | null>(null);

  readonly guardar = output<ProductoRequest>();
  readonly cancelar = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    categoriaId: [null as number | null, [Validators.required]],
    precio: [null as number | null, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.form.patchValue({ categoriaId: this.categoriaInicial() });
  }

  protected enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const valor = this.form.getRawValue();
    this.guardar.emit({
      nombre: valor.nombre.trim(),
      categoriaId: valor.categoriaId!,
      precio: valor.precio!,
    });
  }

  protected mostrarError(campo: 'nombre' | 'categoriaId' | 'precio'): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }
}
