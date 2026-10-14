import { Component } from '@angular/core';

import { ProductosPage } from './features/productos/productos.page';
import { Toast } from './shared/ui/toast';

@Component({
  selector: 'app-root',
  imports: [ProductosPage, Toast],
  templateUrl: './app.html',
})
export class App {}
