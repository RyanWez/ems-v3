// Import RolePermissions for compatibility
import type { RolePermissions } from "@/app/dashboard/user-management/roles/types/permissions";

// User and Permission Types - Compatible with existing RolePermissions
export type Permission = RolePermissions | { [key: string]: any };

export interface Role {
  id: number;
  name: string;
  permissions: Permission;
}

export interface User {
  id: number;
  username: string;
  role: string;
  permissions?: Permission;
}

// Session Management Types
export interface SessionData {
  username: string;
  role: string;
  userId: number;
  permissions?: Permission;
  expiresAt: Date;
  [key: string]: any; // Index signature for JWT compatibility
}

export interface JWTPayload extends SessionData {
  iat?: number;
  exp?: number;
}

// Auth Context Types
export interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  userRole: string | null;
  permissions: Permission | null;
  isLoading: boolean;
  revalidate: () => Promise<void>;
  logout: () => Promise<void>;
}

// Form Types
export interface LoginFormData {
  username: string;
  password: string;
}

export interface FormErrors {
  username?: string;
  password?: string;
}

export interface TouchedFields {
  username: boolean;
  password: boolean;
}

// API Request Types
export interface LoginRequest {
  username: string;
  password: string;
}

// API Response Types
export interface LoginSuccessResponse {
  success: true;
  user: {
    username: string;
    role: string;
    permissions?: Permission;
  };
}

export interface LoginErrorResponse {
  success?: false;
  error: string;
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

export interface LogoutSuccessResponse {
  success: true;
  message: string;
}

export interface LogoutErrorResponse {
  success?: false;
  error: string;
}

export type LogoutResponse = LogoutSuccessResponse | LogoutErrorResponse;

// Generic API Error Response
export interface ErrorResponse {
  error: string;
  code?: string;
  details?: string;
}

// Server Action Response Types
export interface AuthActionResult {
  error?: string;
}

// Database User Type (from Prisma)
export interface DatabaseUser {
  id: number;
  name: string;
  password: string;
  role: {
    id: number;
    name: string;
    permissions: Permission;
  };
}
