import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Permission } from '../models/permission.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private apiUrl = `${environment.apiUrl}/Permission`;
  private roleApiUrl = `${environment.apiUrl}/Role`;

  constructor(private http: HttpClient) {}

  getPermissions(): Observable<Permission[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response: any) => {
        const values = response.$values ?? response;
        return values.map((p: any) => ({
          id: p.Id,
          name: p.Name,
          code: p.Code,
          description: p.Description,
          module: p.Module,
          action: p.Action
        }));
      })
    );
  }

  getPermission(id: number): Observable<Permission> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((p: any) => ({
        id: p.Id,
        name: p.Name,
        code: p.Code,
        description: p.Description,
        module: p.Module,
        action: p.Action
      }))
    );
  }

  createPermission(permission: Permission): Observable<Permission> {
    return this.http.post<any>(this.apiUrl, permission).pipe(
      map((p: any) => ({
        id: p.Id,
        name: p.Name,
        code: p.Code,
        description: p.Description,
        module: p.Module,
        action: p.Action
      }))
    );
  }

  updatePermission(permission: Permission): Observable<Permission> {
    return this.http.put<any>(`${this.apiUrl}/${permission.id}`, permission).pipe(
      map((p: any) => ({
        id: p.Id,
        name: p.Name,
        code: p.Code,
        description: p.Description,
        module: p.Module,
        action: p.Action
      }))
    );
  }

  deletePermission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPermissionsByModule(module: string): Observable<Permission[]> {
    return this.http.get<any>(`${this.apiUrl}/module/${module}`).pipe(
      map((response: any) => {
        const values = response.$values ?? response;
        return values.map((p: any) => ({
          id: p.Id,
          name: p.Name,
          code: p.Code,
          description: p.Description,
          module: p.Module,
          action: p.Action
        }));
      })
    );
  }

  // Métodos para roles (asignación de permisos)
  getPermissionsByRole(roleId: number): Observable<Permission[]> {
    return this.http.get<any>(`${this.roleApiUrl}/${roleId}/permissions`).pipe(
      map((response: any) => {
        const values = response.$values ?? response;
        return values.map((p: any) => ({
          id: p.Id,
          name: p.Name,
          code: p.Code,
          description: p.Description,
          module: p.Module,
          action: p.Action
        }));
      })
    );
  }

  assignPermissionsToRole(roleId: number, permissionIds: number[]): Observable<void> {
    return this.http.post<void>(`${this.roleApiUrl}/${roleId}/permissions`, permissionIds);
  }

  removePermissionsFromRole(roleId: number, permissionIds: number[]): Observable<void> {
    return this.http.request<void>('delete', `${this.roleApiUrl}/${roleId}/permissions`, { body: permissionIds });
  }
} 