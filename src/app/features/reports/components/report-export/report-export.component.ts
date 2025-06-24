import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-export',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  templateUrl: './report-export.component.html',
  styleUrls: ['./report-export.component.scss']
})
export class ReportExportComponent {
  loading = false;
  exportParams = {};

  constructor(
    private reportService: ReportService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  export() {
    this.loading = true;
    this.reportService.exportReport(this.exportParams).subscribe({
      next: (blob) => {
        if (isPlatformBrowser(this.platformId)) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'reporte.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
} 