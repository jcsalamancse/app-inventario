import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReportsListComponent } from './components/reports-list/reports-list.component';
import { ReportStatsComponent } from './components/report-stats/report-stats.component';
import { ReportExportComponent } from './components/report-export/report-export.component';
import { ReportGeneratorComponent } from './components/report-generator/report-generator.component';
import { reportsRoutes } from './reports.routes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(reportsRoutes),
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ReportsListComponent,
    ReportStatsComponent,
    ReportExportComponent,
    ReportGeneratorComponent
  ]
})
export class ReportsModule {} 