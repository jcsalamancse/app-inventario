import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reports-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loading = false;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.fetchReports();
  }

  fetchReports() {
    this.loading = true;
    this.reportService.getReports().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  exportReport(report: any) {
    // Aquí puedes implementar la lógica de exportación individual si lo deseas
  }
} 