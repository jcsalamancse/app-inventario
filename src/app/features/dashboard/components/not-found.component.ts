import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center h-full py-20">
      <h1 class="text-4xl font-bold text-red-600 mb-4">404</h1>
      <p class="text-lg text-gray-700 mb-6">Página no encontrada</p>
      <a routerLink="/dashboard" class="text-blue-600 hover:underline">Ir al dashboard</a>
    </div>
  `
})
export class NotFoundComponent {} 