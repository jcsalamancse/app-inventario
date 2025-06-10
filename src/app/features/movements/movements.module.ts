import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importar aquí los componentes de movimientos cuando existan
import { MovementService } from './services/movement.service';

@NgModule({
  declarations: [
    // Agregar aquí los componentes de movimientos
  ],
  imports: [
    CommonModule
  ],
  providers: [
    MovementService
  ]
})
export class MovementsModule {} 