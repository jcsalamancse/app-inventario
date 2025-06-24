import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-report-stats',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './report-stats.component.html',
  styleUrls: ['./report-stats.component.scss']
})
export class ReportStatsComponent implements OnInit {
  stats: any;
  loading = false;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.fetchStats();
  }

  fetchStats() {
    this.loading = true;
    this.reportService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
} 