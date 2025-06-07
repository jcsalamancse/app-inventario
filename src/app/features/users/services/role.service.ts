import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface Role {
  id: number;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt?: string;
  permissions?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = `${environment.apiUrl}/Role`;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => (response?.$values ?? []).map((r: any) => ({
        id: r.Id,
        name: r.Name,
        code: r.Code,
        description: r.Description,
        isActive: r.IsActive,
        isDefault: r.IsDefault,
        createdAt: r.CreatedAt,
        updatedAt: r.UpdatedAt,
        permissions: r.Permissions?.$values ?? []
      })))
    );
  }

  getRoleById(id: number): Observable<Role> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(r => ({
        id: r.Id,
        name: r.Name,
        code: r.Code,
        description: r.Description,
        isActive: r.IsActive,
        isDefault: r.IsDefault,
        createdAt: r.CreatedAt,
        updatedAt: r.UpdatedAt,
        permissions: r.Permissions?.$values ?? []
      }))
    );
  }

  getRoleByCode(code: string): Observable<Role> {
    return this.http.get<any>(`${this.apiUrl}/code/${code}`).pipe(
      map(r => ({
        id: r.Id,
        name: r.Name,
        code: r.Code,
        description: r.Description,
        isActive: r.IsActive,
        isDefault: r.IsDefault,
        createdAt: r.CreatedAt,
        updatedAt: r.UpdatedAt,
        permissions: r.Permissions?.$values ?? []
      }))
    );
  }

  createRole(role: Partial<Role>): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, role);
  }

  updateRole(id: number, role: Partial<Role>): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/${id}`, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateRoleStatus(id: number, isActive: boolean): Observable<Role> {
    return this.updateRole(id, { isActive });
  }

  getRolePermissions(id: number): Observable<string[]> {
    return this.http.get<any>(`${this.apiUrl}/${id}/permissions`).pipe(
      map(response => response?.$values ?? [])
    );
  }

  addRolePermission(roleId: number, permissionId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${roleId}/permissions/${permissionId}`, {});
  }

  removeRolePermission(roleId: number, permissionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${roleId}/permissions/${permissionId}`);
  }

  setDefaultRole(id: number): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/${id}/default`, {});
  }
} 