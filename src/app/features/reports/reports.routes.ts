import { Routes } from '@angular/router';
import { ReportsListComponent } from './components/reports-list/reports-list.component';
import { ReportStatsComponent } from './components/report-stats/report-stats.component';
import { ReportExportComponent } from './components/report-export/report-export.component';
import { ReportGeneratorComponent } from './components/report-generator/report-generator.component';

export const reportsRoutes: Routes = [
  {
    path: '',
    component: ReportGeneratorComponent
  },
  {
    path: 'stats',
    component: ReportStatsComponent
  },
  {
    path: 'export',
    component: ReportExportComponent
  },
  {
    path: 'list',
    component: ReportsListComponent
  }
]; 