import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

const MODULES = [
  { value: 'sales', label: 'Ventas', description: 'Reportes de ventas y transacciones comerciales' },
  { value: 'inventory', label: 'Inventario', description: 'Estado actual del inventario y stock' },
  { value: 'movements', label: 'Movimientos', description: 'Movimientos de entrada y salida de productos' },
  { value: 'products', label: 'Productos', description: 'Información detallada de productos' },
  { value: 'suppliers', label: 'Proveedores', description: 'Datos de proveedores y suministros' },
  { value: 'categories', label: 'Categorías', description: 'Clasificación de productos por categorías' },
  { value: 'audit', label: 'Auditoría', description: 'Logs de auditoría y cambios en el sistema' },
  { value: 'purchases', label: 'Compras', description: 'Reportes de compras y órdenes' },
  { value: 'estadisticas', label: 'Estadísticas', description: 'Métricas y estadísticas generales' },
  { value: 'users', label: 'Usuarios', description: 'Información de usuarios del sistema' },
  { value: 'clients', label: 'Clientes', description: 'Datos de clientes y contactos' }
];

const FORMATS = [
  { value: 'csv', label: 'CSV', description: 'Archivo de valores separados por comas' },
  { value: 'xlsx', label: 'Excel', description: 'Archivo de Excel (.xlsx)' },
  { value: 'pdf', label: 'PDF', description: 'Documento PDF' }
];

interface FieldInfo {
  name: string;
  type: string;
  description: string;
  example: any;
  isRequired?: boolean;
  isDate?: boolean;
  isNumeric?: boolean;
  isObject?: boolean;
  isArray?: boolean;
}

@Component({
  selector: 'app-report-generator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './report-generator.component.html',
  styleUrls: ['./report-generator.component.scss']
})
export class ReportGeneratorComponent implements OnInit {
  form: FormGroup;
  loading = false;
  results: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];
  modules = MODULES;
  formats = FORMATS;
  availableFields: FieldInfo[] = [];
  selectedFields: string[] = [];
  showFieldSelector = false;

  constructor(private fb: FormBuilder, private reportService: ReportService) {
    this.form = this.fb.group({
      module: [null, Validators.required],
      startDate: [],
      endDate: [],
      groupBy: [],
      searchTerm: [],
      includeDetails: [true], // Por defecto incluir detalles
      includeInactive: [false],
      columns: [[], Validators.required],
      sortBy: [],
      sortOrder: ['desc'],
      page: [1],
      pageSize: [50], // Aumentar para obtener más datos
      format: ['xlsx', Validators.required]
    });
  }

  ngOnInit(): void {
    this.form.get('module')?.valueChanges.subscribe(module => {
      if (module) {
        this.loadSampleData(module);
      }
    });
  }

  /**
   * Carga datos de muestra para detectar campos disponibles
   */
  loadSampleData(module: string) {
    this.loading = true;
    const sampleParams = {
      module,
      page: 1,
      pageSize: 10, // Solo algunos registros para detectar campos
      includeDetails: true
    };

    this.reportService.getReports(sampleParams).subscribe({
      next: (data) => {
        const sampleData = Array.isArray(data) ? data : (data.items || data.$values || []);
        this.analyzeFields(sampleData);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos de muestra:', err);
        this.loading = false;
        // Si falla, usar campos por defecto
        this.setDefaultFields(module);
      }
    });
  }

  /**
   * Analiza los datos para detectar todos los campos disponibles, incluyendo los de Extra
   */
  analyzeFields(data: any[]) {
    if (data.length === 0) {
      this.setDefaultFields(this.form.value.module);
      return;
    }

    const fieldMap = new Map<string, FieldInfo>();
    const extraKeys = new Set<string>();

    data.forEach(item => {
      // Campos de primer nivel
      Object.keys(item).forEach(key => {
        if (key !== 'Extra' && !fieldMap.has(key)) {
          const value = item[key];
          const fieldInfo: FieldInfo = {
            name: key,
            type: this.getFieldType(value),
            description: this.generateFieldDescription(key, value),
            example: this.getFieldExample(value),
            isRequired: this.isFieldRequired(key),
            isDate: this.isDateField(value),
            isNumeric: this.isNumericField(value),
            isObject: this.isObject(value),
            isArray: Array.isArray(value)
          };
          fieldMap.set(key, fieldInfo);
        }
        // Si es Extra, recolectar sus claves
        if (key === 'Extra' && item[key] && typeof item[key] === 'object') {
          Object.keys(item[key]).forEach(extraKey => {
            extraKeys.add(extraKey);
          });
        }
      });
    });

    // Agregar los campos de Extra como columnas individuales
    extraKeys.forEach(extraKey => {
      if (!fieldMap.has(extraKey)) {
        // Buscar un ejemplo de valor
        let example = null;
        for (const item of data) {
          if (item.Extra && item.Extra[extraKey] !== undefined) {
            example = item.Extra[extraKey];
            break;
          }
        }
        const fieldInfo: FieldInfo = {
          name: extraKey,
          type: this.getFieldType(example),
          description: this.generateFieldDescription(extraKey, example),
          example: this.getFieldExample(example),
          isRequired: false,
          isDate: this.isDateField(example),
          isNumeric: this.isNumericField(example),
          isObject: this.isObject(example),
          isArray: Array.isArray(example)
        };
        fieldMap.set(extraKey, fieldInfo);
      }
    });

    this.availableFields = Array.from(fieldMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    this.selectedFields = this.availableFields.map(f => f.name);
    this.form.get('columns')?.setValue(this.selectedFields);
    
    console.log('Campos detectados:', this.availableFields);
  }

  /**
   * Determina el tipo de campo basado en el valor
   */
  getFieldType(value: any): string {
    if (value === null || value === undefined) return 'null';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (this.isIsoDate(value)) return 'date';
    return 'string';
  }

  /**
   * Genera una descripción del campo
   */
  generateFieldDescription(key: string, value: any): string {
    const keyLower = key.toLowerCase();
    
    // Descripciones específicas por nombre de campo
    const descriptions: { [key: string]: string } = {
      'id': 'Identificador único del registro',
      'name': 'Nombre o título del elemento',
      'description': 'Descripción detallada',
      'createdat': 'Fecha de creación',
      'updatedat': 'Fecha de última actualización',
      'status': 'Estado actual del elemento',
      'active': 'Indica si el elemento está activo',
      'quantity': 'Cantidad o stock disponible',
      'price': 'Precio unitario',
      'total': 'Valor total',
      'count': 'Número de elementos',
      'type': 'Tipo de categorización',
      'category': 'Categoría del elemento',
      'user': 'Usuario responsable',
      'email': 'Dirección de correo electrónico',
      'phone': 'Número de teléfono',
      'address': 'Dirección física',
      'date': 'Fecha del evento',
      'time': 'Hora del evento',
      'amount': 'Cantidad monetaria',
      'balance': 'Saldo disponible',
      'code': 'Código de identificación',
      'reference': 'Número de referencia',
      'notes': 'Notas o comentarios',
      'tags': 'Etiquetas asociadas',
      'group': 'Agrupación de elementos',
      'level': 'Nivel o jerarquía',
      'priority': 'Prioridad del elemento',
      'score': 'Puntuación o calificación'
    };

    // Buscar descripción específica
    for (const [pattern, desc] of Object.entries(descriptions)) {
      if (keyLower.includes(pattern)) {
        return desc;
      }
    }

    // Descripción genérica basada en el tipo
    const type = this.getFieldType(value);
    switch (type) {
      case 'date': return 'Fecha y hora del evento';
      case 'number': return 'Valor numérico';
      case 'boolean': return 'Valor verdadero o falso';
      case 'object': return 'Objeto con información adicional';
      case 'array': return 'Lista de elementos';
      default: return 'Campo de texto';
    }
  }

  /**
   * Obtiene un ejemplo del valor del campo
   */
  getFieldExample(value: any): any {
    if (value === null || value === undefined) return 'null';
    if (Array.isArray(value)) {
      return value.length > 0 ? value[0] : '[]';
    }
    if (typeof value === 'object') {
      return Object.keys(value).length > 0 ? 'Objeto con datos' : '{}';
    }
    return value;
  }

  /**
   * Determina si un campo es requerido
   */
  isFieldRequired(key: string): boolean {
    const requiredFields = ['id', 'name', 'createdat', 'updatedat'];
    return requiredFields.some(field => key.toLowerCase().includes(field));
  }

  /**
   * Determina si un valor es una fecha
   */
  isDateField(value: any): boolean {
    return this.isIsoDate(value) || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value));
  }

  /**
   * Determina si un valor es numérico
   */
  isNumericField(value: any): boolean {
    return typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)));
  }

  /**
   * Establece campos por defecto si no se pueden detectar
   */
  setDefaultFields(module: string) {
    const defaultFields: { [key: string]: FieldInfo[] } = {
      'sales': [
        { name: 'id', type: 'number', description: 'ID de la venta', example: 1, isRequired: true },
        { name: 'total', type: 'number', description: 'Total de la venta', example: 150000, isNumeric: true },
        { name: 'date', type: 'date', description: 'Fecha de la venta', example: '2024-01-15T10:30:00Z', isDate: true },
        { name: 'customerName', type: 'string', description: 'Nombre del cliente', example: 'Juan Pérez' },
        { name: 'productName', type: 'string', description: 'Nombre del producto', example: 'Laptop HP' }
      ],
      'inventory': [
        { name: 'id', type: 'number', description: 'ID del producto', example: 1, isRequired: true },
        { name: 'name', type: 'string', description: 'Nombre del producto', example: 'Laptop HP', isRequired: true },
        { name: 'quantity', type: 'number', description: 'Cantidad en stock', example: 25, isNumeric: true },
        { name: 'minStock', type: 'number', description: 'Stock mínimo', example: 5, isNumeric: true },
        { name: 'maxStock', type: 'number', description: 'Stock máximo', example: 100, isNumeric: true }
      ],
      'users': [
        { name: 'id', type: 'number', description: 'ID del usuario', example: 1, isRequired: true },
        { name: 'username', type: 'string', description: 'Nombre de usuario', example: 'juan.perez', isRequired: true },
        { name: 'email', type: 'string', description: 'Correo electrónico', example: 'juan@empresa.com' },
        { name: 'role', type: 'string', description: 'Rol del usuario', example: 'Admin' },
        { name: 'active', type: 'boolean', description: 'Usuario activo', example: true }
      ]
    };

    this.availableFields = defaultFields[module] || [
      { name: 'id', type: 'number', description: 'Identificador único', example: 1, isRequired: true },
      { name: 'name', type: 'string', description: 'Nombre', example: 'Ejemplo', isRequired: true },
      { name: 'createdAt', type: 'date', description: 'Fecha de creación', example: '2024-01-15T10:30:00Z', isDate: true }
    ];

    this.selectedFields = this.availableFields.map(f => f.name);
    this.form.get('columns')?.setValue(this.selectedFields);
  }

  /**
   * Alterna la selección de un campo
   */
  toggleField(fieldName: string) {
    const index = this.selectedFields.indexOf(fieldName);
    if (index > -1) {
      this.selectedFields.splice(index, 1);
    } else {
      this.selectedFields.push(fieldName);
    }
    this.form.get('columns')?.setValue(this.selectedFields);
  }

  /**
   * Selecciona todos los campos
   */
  selectAllFields() {
    this.selectedFields = this.availableFields.map(f => f.name);
    this.form.get('columns')?.setValue(this.selectedFields);
  }

  /**
   * Deselecciona todos los campos
   */
  deselectAllFields() {
    this.selectedFields = [];
    this.form.get('columns')?.setValue(this.selectedFields);
  }

  /**
   * Detecta si un valor es una fecha ISO (formato UTC)
   */
  isIsoDate(value: any): boolean {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z$/.test(value);
  }

  /**
   * Convierte una fecha ISO a hora local de Colombia (America/Bogota)
   */
  toColombiaTime(value: string): string {
    try {
      const date = new Date(value);
      return date.toLocaleString('es-CO', { timeZone: 'America/Bogota' });
    } catch {
      return value;
    }
  }

  isObject(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
  }

  formatObject(value: any): string {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return '[Objeto]';
    }
  }

  generateReport() {
    if (this.form.invalid) return;
    this.loading = true;
    const params = { ...this.form.value };
    if (params.startDate) params.startDate = new Date(params.startDate).toISOString();
    if (params.endDate) params.endDate = new Date(params.endDate).toISOString();
    
    this.reportService.getReports(params).subscribe({
      next: (data) => {
        this.results = Array.isArray(data) ? data : (data.items || data.$values || []);
        this.dataSource.data = this.results;
        
        // Actualizar columnas mostradas basadas en los campos seleccionados
        this.displayedColumns = this.selectedFields.filter(field => 
          this.results.some(row => row.hasOwnProperty(field))
        );
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al generar reporte:', err);
        this.loading = false;
      }
    });
  }

  exportReport() {
    if (this.form.invalid || !this.results.length) return;
    this.loading = true;
    
    const params = {
      filter: { ...this.form.value },
      format: this.form.value.format,
      includeDetails: this.form.value.includeDetails,
      columns: this.selectedFields
    };
    
    if (params.filter.startDate) params.filter.startDate = new Date(params.filter.startDate).toISOString();
    if (params.filter.endDate) params.filter.endDate = new Date(params.filter.endDate).toISOString();
    
    console.log('Exportando reporte con payload:', params);
    
    this.reportService.exportReport(params).subscribe({
      next: (blob) => {
        console.log('Archivo recibido:', blob);
        if (blob && blob.size > 0) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reporte_${this.form.value.module}_${new Date().toISOString().split('T')[0]}.${this.form.value.format}`;
          a.click();
          window.URL.revokeObjectURL(url);
        } else {
          alert('No hay datos para exportar o el archivo está vacío. Verifica los filtros y columnas seleccionadas.');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al exportar reporte:', err);
        alert('Error al exportar el reporte. Revisa la consola para más detalles.');
        this.loading = false;
      }
    });
  }

  /**
   * Obtiene información de un campo específico
   */
  getFieldInfo(fieldName: string): FieldInfo | undefined {
    return this.availableFields.find(field => field.name === fieldName);
  }
} 