import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <!-- Fondo oscuro -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" (click)="onClose()"></div>

      <!-- Contenedor del modal -->
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <!-- Encabezado -->
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="flex items-start justify-between">
              <h3 class="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
                {{ title }}
              </h3>
              <button type="button" 
                      class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                      (click)="onClose()">
                <span class="sr-only">Cerrar</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Contenido -->
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <ng-content></ng-content>
          </div>

          <!-- Pie del modal -->
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6" *ngIf="showFooter">
            <ng-content select="[modalFooter]"></ng-content>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() showFooter = true;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
} 