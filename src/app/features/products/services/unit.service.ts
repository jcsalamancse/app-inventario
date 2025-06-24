import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Unit } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class UnitService {
  private apiUrl = `${environment.apiUrl}/Unit`;

  // Datos mock de unidades de medida completas
  private mockUnits: Unit[] = [
    // Unidades de Peso
    { id: 1, name: 'Gramo', symbol: 'g', categoryId: 1, type: 'weight' },
    { id: 2, name: 'Kilogramo', symbol: 'kg', categoryId: 1, type: 'weight' },
    { id: 3, name: 'Libra', symbol: 'lb', categoryId: 1, type: 'weight' },
    { id: 4, name: 'Onza', symbol: 'oz', categoryId: 1, type: 'weight' },
    { id: 5, name: 'Tonelada', symbol: 't', categoryId: 1, type: 'weight' },
    { id: 6, name: 'Quintal', symbol: 'qq', categoryId: 1, type: 'weight' },
    
    // Unidades de Volumen
    { id: 7, name: 'Litro', symbol: 'L', categoryId: 2, type: 'volume' },
    { id: 8, name: 'Mililitro', symbol: 'mL', categoryId: 2, type: 'volume' },
    { id: 9, name: 'Galón', symbol: 'gal', categoryId: 2, type: 'volume' },
    { id: 10, name: 'Metro cúbico', symbol: 'm³', categoryId: 2, type: 'volume' },
    { id: 11, name: 'Centímetro cúbico', symbol: 'cm³', categoryId: 2, type: 'volume' },
    { id: 12, name: 'Pinta', symbol: 'pt', categoryId: 2, type: 'volume' },
    
    // Unidades de Longitud
    { id: 13, name: 'Metro', symbol: 'm', categoryId: 3, type: 'length' },
    { id: 14, name: 'Centímetro', symbol: 'cm', categoryId: 3, type: 'length' },
    { id: 15, name: 'Milímetro', symbol: 'mm', categoryId: 3, type: 'length' },
    { id: 16, name: 'Kilómetro', symbol: 'km', categoryId: 3, type: 'length' },
    { id: 17, name: 'Pulgada', symbol: 'in', categoryId: 3, type: 'length' },
    { id: 18, name: 'Pie', symbol: 'ft', categoryId: 3, type: 'length' },
    { id: 19, name: 'Yarda', symbol: 'yd', categoryId: 3, type: 'length' },
    
    // Tallas de Ropa
    { id: 20, name: 'XS', symbol: 'XS', categoryId: 4, type: 'size' },
    { id: 21, name: 'S', symbol: 'S', categoryId: 4, type: 'size' },
    { id: 22, name: 'M', symbol: 'M', categoryId: 4, type: 'size' },
    { id: 23, name: 'L', symbol: 'L', categoryId: 4, type: 'size' },
    { id: 24, name: 'XL', symbol: 'XL', categoryId: 4, type: 'size' },
    { id: 25, name: 'XXL', symbol: 'XXL', categoryId: 4, type: 'size' },
    { id: 26, name: 'XXXL', symbol: 'XXXL', categoryId: 4, type: 'size' },
    
    // Tallas de Zapatos
    { id: 27, name: 'Talla 34', symbol: '34', categoryId: 5, type: 'shoe_size' },
    { id: 28, name: 'Talla 35', symbol: '35', categoryId: 5, type: 'shoe_size' },
    { id: 29, name: 'Talla 36', symbol: '36', categoryId: 5, type: 'shoe_size' },
    { id: 30, name: 'Talla 37', symbol: '37', categoryId: 5, type: 'shoe_size' },
    { id: 31, name: 'Talla 38', symbol: '38', categoryId: 5, type: 'shoe_size' },
    { id: 32, name: 'Talla 39', symbol: '39', categoryId: 5, type: 'shoe_size' },
    { id: 33, name: 'Talla 40', symbol: '40', categoryId: 5, type: 'shoe_size' },
    { id: 34, name: 'Talla 41', symbol: '41', categoryId: 5, type: 'shoe_size' },
    { id: 35, name: 'Talla 42', symbol: '42', categoryId: 5, type: 'shoe_size' },
    { id: 36, name: 'Talla 43', symbol: '43', categoryId: 5, type: 'shoe_size' },
    { id: 37, name: 'Talla 44', symbol: '44', categoryId: 5, type: 'shoe_size' },
    { id: 38, name: 'Talla 45', symbol: '45', categoryId: 5, type: 'shoe_size' },
    
    // Unidades de Área
    { id: 39, name: 'Metro cuadrado', symbol: 'm²', categoryId: 6, type: 'area' },
    { id: 40, name: 'Centímetro cuadrado', symbol: 'cm²', categoryId: 6, type: 'area' },
    { id: 41, name: 'Kilómetro cuadrado', symbol: 'km²', categoryId: 6, type: 'area' },
    { id: 42, name: 'Hectárea', symbol: 'ha', categoryId: 6, type: 'area' },
    { id: 43, name: 'Acre', symbol: 'ac', categoryId: 6, type: 'area' },
    
    // Unidades de Tiempo
    { id: 44, name: 'Hora', symbol: 'h', categoryId: 7, type: 'time' },
    { id: 45, name: 'Minuto', symbol: 'min', categoryId: 7, type: 'time' },
    { id: 46, name: 'Segundo', symbol: 's', categoryId: 7, type: 'time' },
    { id: 47, name: 'Día', symbol: 'd', categoryId: 7, type: 'time' },
    { id: 48, name: 'Semana', symbol: 'sem', categoryId: 7, type: 'time' },
    { id: 49, name: 'Mes', symbol: 'mes', categoryId: 7, type: 'time' },
    { id: 50, name: 'Año', symbol: 'año', categoryId: 7, type: 'time' },
    
    // Unidades de Cantidad
    { id: 51, name: 'Unidad', symbol: 'un', categoryId: 8, type: 'quantity' },
    { id: 52, name: 'Par', symbol: 'par', categoryId: 8, type: 'quantity' },
    { id: 53, name: 'Docena', symbol: 'doc', categoryId: 8, type: 'quantity' },
    { id: 54, name: 'Caja', symbol: 'caja', categoryId: 8, type: 'quantity' },
    { id: 55, name: 'Paquete', symbol: 'pkg', categoryId: 8, type: 'quantity' },
    { id: 56, name: 'Rollos', symbol: 'rollos', categoryId: 8, type: 'quantity' },
    { id: 57, name: 'Set', symbol: 'set', categoryId: 8, type: 'quantity' },
    { id: 58, name: 'Kit', symbol: 'kit', categoryId: 8, type: 'quantity' },
    
    // Unidades de Energía
    { id: 59, name: 'Vatio', symbol: 'W', categoryId: 9, type: 'energy' },
    { id: 60, name: 'Kilovatio', symbol: 'kW', categoryId: 9, type: 'energy' },
    { id: 61, name: 'Caballo de fuerza', symbol: 'hp', categoryId: 9, type: 'energy' },
    { id: 62, name: 'Julio', symbol: 'J', categoryId: 9, type: 'energy' },
    
    // Unidades de Temperatura
    { id: 63, name: 'Celsius', symbol: '°C', categoryId: 10, type: 'temperature' },
    { id: 64, name: 'Fahrenheit', symbol: '°F', categoryId: 10, type: 'temperature' },
    { id: 65, name: 'Kelvin', symbol: 'K', categoryId: 10, type: 'temperature' },
    
    // Unidades de Presión
    { id: 66, name: 'Pascal', symbol: 'Pa', categoryId: 11, type: 'pressure' },
    { id: 67, name: 'Bar', symbol: 'bar', categoryId: 11, type: 'pressure' },
    { id: 68, name: 'PSI', symbol: 'psi', categoryId: 11, type: 'pressure' },
    { id: 69, name: 'Atmósfera', symbol: 'atm', categoryId: 11, type: 'pressure' },
    
    // Unidades de Velocidad
    { id: 70, name: 'Metros por segundo', symbol: 'm/s', categoryId: 12, type: 'speed' },
    { id: 71, name: 'Kilómetros por hora', symbol: 'km/h', categoryId: 12, type: 'speed' },
    { id: 72, name: 'Millas por hora', symbol: 'mph', categoryId: 12, type: 'speed' },
    { id: 73, name: 'Nudos', symbol: 'nudos', categoryId: 12, type: 'speed' },
    
    // Unidades de Frecuencia
    { id: 74, name: 'Hertz', symbol: 'Hz', categoryId: 13, type: 'frequency' },
    { id: 75, name: 'Kilohertz', symbol: 'kHz', categoryId: 13, type: 'frequency' },
    { id: 76, name: 'Megahertz', symbol: 'MHz', categoryId: 13, type: 'frequency' },
    { id: 77, name: 'Gigahertz', symbol: 'GHz', categoryId: 13, type: 'frequency' },
    
    // Unidades de Datos
    { id: 78, name: 'Byte', symbol: 'B', categoryId: 14, type: 'data' },
    { id: 79, name: 'Kilobyte', symbol: 'KB', categoryId: 14, type: 'data' },
    { id: 80, name: 'Megabyte', symbol: 'MB', categoryId: 14, type: 'data' },
    { id: 81, name: 'Gigabyte', symbol: 'GB', categoryId: 14, type: 'data' },
    { id: 82, name: 'Terabyte', symbol: 'TB', categoryId: 14, type: 'data' },
    
    // Unidades de Ángulo
    { id: 83, name: 'Grado', symbol: '°', categoryId: 15, type: 'angle' },
    { id: 84, name: 'Radián', symbol: 'rad', categoryId: 15, type: 'angle' },
    { id: 85, name: 'Grado centesimal', symbol: 'gon', categoryId: 15, type: 'angle' },
    
    // Unidades de Concentración
    { id: 86, name: 'Porcentaje', symbol: '%', categoryId: 16, type: 'concentration' },
    { id: 87, name: 'Partes por millón', symbol: 'ppm', categoryId: 16, type: 'concentration' },
    { id: 88, name: 'Partes por billón', symbol: 'ppb', categoryId: 16, type: 'concentration' },
    { id: 89, name: 'Molar', symbol: 'M', categoryId: 16, type: 'concentration' },
    
    // Unidades de Fuerza
    { id: 90, name: 'Newton', symbol: 'N', categoryId: 17, type: 'force' },
    { id: 91, name: 'Kilonewton', symbol: 'kN', categoryId: 17, type: 'force' },
    { id: 92, name: 'Dina', symbol: 'dyn', categoryId: 17, type: 'force' },
    { id: 93, name: 'Libra-fuerza', symbol: 'lbf', categoryId: 17, type: 'force' }
  ];

  constructor(private http: HttpClient) {}

  getUnits(): Observable<Unit[]> {
    // Usar datos mock por ahora, pero mantener la estructura para el backend
    return of(this.mockUnits);
    
    // Código original para cuando el backend esté listo:
    // return this.http.get<any>(this.apiUrl).pipe(
    //   map(response => (response?.$values ?? response).map((u: any) => ({
    //     id: u.Id,
    //     name: u.Name,
    //     symbol: u.Symbol,
    //     categoryId: u.CategoryId ?? u.categoryId,
    //     type: u.Type ?? u.type
    //   })))
    // );
  }

  getUnitsByCategory(categoryId: number): Observable<Unit[]> {
    return this.getUnits().pipe(
      map(units => units.filter(unit => unit.categoryId === categoryId))
    );
  }

  getUnitsByType(type: string): Observable<Unit[]> {
    return this.getUnits().pipe(
      map(units => units.filter(unit => unit.type === type))
    );
  }

  getAllUnitTypes(): Observable<string[]> {
    return this.getUnits().pipe(
      map(units => [...new Set(units.map(unit => unit.type).filter((type): type is string => type !== undefined))])
    );
  }

  createUnit(unit: { name: string; symbol: string; categoryId?: number; type?: string }): Observable<Unit> {
    const newUnit: Unit = {
      id: Math.max(...this.mockUnits.map(u => u.id)) + 1,
      name: unit.name,
      symbol: unit.symbol,
      categoryId: unit.categoryId,
      type: unit.type || 'quantity'
    };
    
    this.mockUnits.push(newUnit);
    return of(newUnit);
    
    // Código original para cuando el backend esté listo:
    // return this.http.post<Unit>(this.apiUrl, {
    //   Name: unit.name,
    //   Symbol: unit.symbol,
    //   CategoryId: unit.categoryId,
    //   Type: unit.type
    // });
  }

  getUnitById(id: number): Observable<Unit | undefined> {
    return this.getUnits().pipe(
      map(units => units.find(unit => unit.id === id))
    );
  }
} 