import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ModalConfig {
  title: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  showBackdrop?: boolean;
  closeOnBackdropClick?: boolean;
  showFooter?: boolean;
  footerButtons?: ModalButton[];
}

export interface ModalButton {
  text: string;
  type: 'primary' | 'secondary' | 'danger' | 'success';
  action: string;
  disabled?: boolean;
  loading?: boolean;
}

@Component({
  selector: 'app-corporate-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Backdrop -->
    <div 
      *ngIf="isOpen && config.showBackdrop !== false"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity duration-300"
      [class]="isOpen ? 'opacity-100' : 'opacity-0'"
      (click)="config.closeOnBackdropClick !== false && onClose.emit()">
    </div>

    <!-- Modal -->
    <div 
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      [class]="isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'">
      
      <div 
        class="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-h-[90vh] overflow-hidden transition-all duration-300 transform"
        [class]="getModalSize()"
        [class]="isOpen ? 'scale-100' : 'scale-95'">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <div class="flex items-center space-x-4">
            <div class="bg-slate-200 p-2.5 rounded-lg">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-slate-900">{{ config.title }}</h2>
              <p *ngIf="config.subtitle" class="text-sm text-slate-600 mt-1">{{ config.subtitle }}</p>
            </div>
          </div>
          
          <button 
            *ngIf="config.showCloseButton !== false"
            (click)="onClose.emit()"
            class="text-slate-400 hover:text-slate-600 transition-colors duration-200 p-1 rounded-lg hover:bg-slate-100"
            type="button"
            aria-label="Cerrar modal">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <ng-content></ng-content>
        </div>

        <!-- Footer -->
        <div 
          *ngIf="config.showFooter !== false && config.footerButtons?.length"
          class="flex items-center justify-end space-x-3 p-6 border-t border-slate-200 bg-slate-50">
          
          <button 
            *ngFor="let button of config.footerButtons"
            (click)="onAction.emit(button.action)"
            [disabled]="button.disabled || button.loading"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            [class]="getButtonClasses(button.type)"
            type="button">
            
            <div *ngIf="button.loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            {{ button.text }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CorporateModalComponent {
  @Input() isOpen = false;
  @Input() config: ModalConfig = { title: '' };
  
  @Output() onClose = new EventEmitter<void>();
  @Output() onAction = new EventEmitter<string>();

  getModalSize(): string {
    switch (this.config.size) {
      case 'sm': return 'max-w-md';
      case 'md': return 'max-w-lg';
      case 'lg': return 'max-w-2xl';
      case 'xl': return 'max-w-4xl';
      case 'full': return 'max-w-7xl';
      default: return 'max-w-lg';
    }
  }

  getButtonClasses(type: string): string {
    switch (type) {
      case 'primary':
        return 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500';
      case 'secondary':
        return 'bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-500';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      case 'success':
        return 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500';
      default:
        return 'bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-500';
    }
  }
} 