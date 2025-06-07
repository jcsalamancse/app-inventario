import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UserListComponent],
  template: `
    <div class="container mx-auto p-4">
      <app-user-list></app-user-list>
    </div>
  `,
  styles: []
})
export class UsersComponent {} 