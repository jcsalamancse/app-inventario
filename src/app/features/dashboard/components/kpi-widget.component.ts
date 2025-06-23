import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kpi-widget',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:bg-white/15 transition-colors flex flex-col justify-between h-full">
      <div class="flex items-center justify-between mb-4">
        <div [ngClass]="iconBg" class="p-3 rounded-xl">
          <mat-icon [fontIcon]="icon" [ngClass]="iconColor + ' text-2xl'"></mat-icon>
        </div>
        <span class="text-green-400 text-sm font-medium flex items-center gap-1" *ngIf="trend !== undefined">
          <mat-icon fontIcon="trending_up" class="text-lg"></mat-icon>
          {{ trend }}
        </span>
      </div>
      <div class="flex flex-col">
        <span class="text-3xl font-bold text-white mb-1">{{ value }}</span>
        <span class="text-purple-200 text-sm">{{ label }}</span>
      </div>
    </div>
  `,
  styles: []
})
export class KpiWidgetComponent {
  @Input() icon: string = '';
  @Input() iconColor: string = '';
  @Input() iconBg: string = '';
  @Input() value: number | string = 0;
  @Input() label: string = '';
  @Input() trend?: string;
} 