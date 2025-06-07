export interface User {
  Id: number;
  UserName: string;
  Email: string;
  PasswordHash?: string;
  RoleId: number;
  Role?: {
    Id: number;
    Name: string;
    Description?: string;
    Code?: string;
    IsSystem?: boolean;
    IsActive?: boolean;
    IsDefault?: boolean;
    CreatedAt?: string;
    UpdatedAt?: string | null;
    Permissions?: any;
  };
  FirstName: string;
  LastName: string;
  Phone?: string | null;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt?: string;
  ResetPasswordToken?: string | null;
  ResetPasswordTokenExpiry?: string | null;
  FullName?: string;
  Movements?: any;
  Sales?: any;
  Purchases?: any;
  UserPreferences?: any;
  NotificationConfigurations?: any;
}

export interface UserCreateDto {
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: number;
  phoneNumber?: string;
  department?: string;
  position?: string;
}

export interface UserUpdateDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  roleId?: number;
  isActive?: boolean;
  phoneNumber?: string;
  department?: string;
  position?: string;
}

export interface UserResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface UserListResponse {
  success: boolean;
  data: User[];
  message?: string;
  total: number;
  page: number;
  pageSize: number;
} 