import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface Category {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/Category`;
  private jsonHeaders = new HttpHeaders({ 'Accept': 'application/json' });

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<any>(this.apiUrl, { headers: this.jsonHeaders }).pipe(
      map(response => {
        // Si la respuesta es un array directo
        if (Array.isArray(response)) {
          return response.map((cat: any) => ({
            id: cat.Id ?? cat.id,
            name: cat.Name ?? cat.name,
            description: cat.Description ?? cat.description,
            isActive: cat.IsActive ?? cat.isActive
          }));
        }
        // Si la respuesta es el formato .NET con $values
        return (response?.$values || []).map((cat: any) => ({
          id: cat.Id ?? cat.id,
          name: cat.Name ?? cat.name,
          description: cat.Description ?? cat.description,
          isActive: cat.IsActive ?? cat.isActive
        }));
      })
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`, { headers: this.jsonHeaders });
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    const payload = {
      Name: category.name,
      Description: category.description,
      IsActive: category.isActive
    };
    return this.http.post<Category>(this.apiUrl, payload, { headers: this.jsonHeaders });
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    const payload = {
      Id: id,
      Name: category.name ?? '',
      Description: category.description ?? '',
      IsActive: category.isActive ?? false
    };
    return this.http.put<Category>(`${this.apiUrl}/${id}`, payload, { headers: this.jsonHeaders });
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.jsonHeaders });
  }
} 