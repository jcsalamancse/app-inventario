import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Permission } from '../models/permission.model';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private apiUrl = `${environment.apiUrl}/Permission`;

  constructor(private http: HttpClient) {}

  getPermissions(): Observable<Permission[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => (response?.$values ?? []).map((p: any) => ({
        id: p.Id,
        name: p.Name,
        description: p.Description,
        code: p.Code
      })))
    );
  }

  getPermissionById(id: number): Observable<Permission> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(p => ({
        id: p.Id,
        name: p.Name,
        description: p.Description,
        code: p.Code
      }))
    );
  }

  createPermission(permission: Partial<Permission>): Observable<Permission> {
    return this.http.post<Permission>(this.apiUrl, permission);
  }

  updatePermission(id: number, permission: Partial<Permission>): Observable<Permission> {
    return this.http.put<Permission>(`${this.apiUrl}/${id}`, permission);
  }

  deletePermission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 