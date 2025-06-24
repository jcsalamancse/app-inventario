import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ViewContainerRef } from '@angular/core';
import { UserMenuOverlayComponent } from './user-menu-overlay.component';
import { NotificationsOverlayComponent } from './notifications-overlay.component';
import { ChangePasswordDialogComponent } from './change-password-dialog.component';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from './services/dashboard.service';
import { KpiWidgetComponent } from './components/kpi-widget.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatMenuModule, 
    MatBadgeModule, 
    MatDialogModule, 
    HttpClientModule, 
    MatProgressSpinnerModule, 
    NgChartsModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  username: string | null = null;
  email: string | null = null;
  now: Date = new Date();
  private dialog = inject(MatDialog);
  movimientos$: any;
  loadingMovimientos = false;
  private overlayRef: OverlayRef | null = null;
  isNotificationsOpen = false;
  private notificationsOverlayRef: OverlayRef | null = null;
  isBrowser = false;
  productosKpi$: any;
  movimientosKpi$: any;
  usuariosKpi$: any;

  // Gráfica de movimientos por mes
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Movimientos', backgroundColor: '#3b82f6' }
    ]
  };
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Movimientos por mes', color: '#fff', font: { size: 18 } }
    },
    scales: {
      x: { ticks: { color: '#fff' }, grid: { color: '#8882' } },
      y: { ticks: { color: '#fff' }, grid: { color: '#8882' } }
    }
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public router: Router,
    private overlay: Overlay,
    private vcr: ViewContainerRef,
    private authService: AuthService,
    private dashboardService: DashboardService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    let token = '';
    if (this.isBrowser) {
      token = localStorage.getItem('token') || '';
    }
    if (token) {
      const payload = this.decodeJWT(token);
      this.username = payload?.username || payload?.userName || null;
      this.email = payload?.email || null;
    }
    this.movimientos$ = this.dashboardService.getRecentMovements();
    this.productosKpi$ = this.dashboardService.getTopProducts();
    this.movimientosKpi$ = this.dashboardService.getRecentMovements();
    this.usuariosKpi$ = this.dashboardService.getTopSuppliers();
  }

  decodeJWT(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    } catch {
      return null;
    }
  }

  onLogout() {
    const dialogRef = this.dialog.open(ConfirmLogoutDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        if (this.isBrowser) {
          localStorage.clear();
        }
        this.router.navigate(['/login']);
      }
    });
  }

  openUserMenu(origin: EventTarget | null) {
    if (!origin || !(origin instanceof HTMLElement)) return;
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'transparent-backdrop',
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(origin)
        .withPositions([
          {
            originX: 'end', originY: 'bottom',
            overlayX: 'end', overlayY: 'top',
            offsetY: 8
          }
        ])
    });
    const userMenuPortal = new ComponentPortal(UserMenuOverlayComponent, this.vcr);
    const componentRef = this.overlayRef.attach(userMenuPortal);
    componentRef.instance.username = this.username;
    componentRef.instance.email = this.email;
    componentRef.instance.changePassword.subscribe(() => {
      this.onChangePassword();
      this.overlayRef?.dispose();
    });
    componentRef.instance.logout.subscribe(() => {
      this.onLogout();
      this.overlayRef?.dispose();
    });
    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef?.dispose();
    });
  }

  onChangePassword() {
    this.authService.getMe().subscribe(usuario => {
      console.log('Usuario autenticado recibido para cambio de contraseña:', usuario);
      this.dialog.open(ChangePasswordDialogComponent, {
        data: { usuario }
      });
    }, error => {
      alert('No se pudo obtener la información del usuario. Intenta recargar la página.');
    });
  }

  openNotifications() {
    if (this.notificationsOverlayRef) {
      this.notificationsOverlayRef.dispose();
    }
    this.isNotificationsOpen = true;
    this.notificationsOverlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'transparent-backdrop',
      positionStrategy: this.overlay.position()
        .global()
        .top('80px')
        .right('32px')
    });
    const notificationsPortal = new ComponentPortal(NotificationsOverlayComponent, this.vcr);
    const componentRef = this.notificationsOverlayRef.attach(notificationsPortal);
    (componentRef.instance as NotificationsOverlayComponent).close.subscribe(() => {
      this.closeNotifications();
      this.notificationsOverlayRef?.dispose();
    });
    this.notificationsOverlayRef.backdropClick().subscribe(() => {
      this.closeNotifications();
      this.notificationsOverlayRef?.dispose();
    });
  }

  closeNotifications() {
    this.isNotificationsOpen = false;
    this.notificationsOverlayRef?.dispose();
  }

  getKpiValue(data: any): number {
    if (!data) return 0;
    if (Array.isArray(data)) return data.length;
    if (typeof data.total === 'number') return data.total;
    if (typeof data.count === 'number') return data.count;
    if (Array.isArray(data.$values)) return data.$values.length;
    return 0;
  }

  getMovimientosArray(data: any): any[] {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.$values)) return data.$values;
    return [];
  }
}

@Component({
  selector: 'confirm-logout-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, CommonModule],
  template: `
    <div class="p-4 sm:p-6 text-center max-w-sm mx-auto">
      <div class="flex flex-col items-center">
        <div class="bg-red-500/10 p-4 rounded-full mb-4">
          <div class="bg-red-500/20 p-3 rounded-full">
            <mat-icon fontIcon="logout" class="text-red-500 text-3xl sm:text-4xl"></mat-icon>
          </div>
        </div>
        <h2 class="text-lg sm:text-xl font-bold mb-2 text-gray-800">¿Cerrar sesión?</h2>
        <p class="mb-6 text-gray-600 text-sm sm:text-base">¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a iniciar sesión para acceder al sistema.</p>
        <div class="flex flex-col sm:flex-row justify-center gap-3 w-full">
          <button 
            mat-stroked-button 
            color="primary" 
            (click)="dialogRef.close(false)"
            class="w-full sm:w-auto px-6 py-2">
            Cancelar
          </button>
          <button 
            mat-raised-button 
            color="warn" 
            (click)="dialogRef.close(true)"
            class="w-full sm:w-auto px-6 py-2">
            <mat-icon fontIcon="logout" class="mr-2"></mat-icon>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      animation: fadeIn 0.2s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class ConfirmLogoutDialog {
  constructor(public dialogRef: MatDialogRef<ConfirmLogoutDialog>) {}
}
