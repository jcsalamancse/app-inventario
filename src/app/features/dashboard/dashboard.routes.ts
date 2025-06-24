export const dashboardRoutes = [
  {
    path: 'reportes',
    loadChildren: () => import('../reports/reports.module').then(m => m.ReportsModule)
  }
]; 