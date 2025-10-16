export interface User {
  id: number;
  username: string;
  role: string;
  permissions?: any;
}

export interface SessionData {
  username: string;
  role: string;
  userId: number;
  permissions?: any;
  expiresAt?: Date;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  userRole: string | null;
  permissions: any | null;
  isLoading: boolean;
  revalidate: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface LoginResponse {
  success?: boolean;
  error?: string;
  user?: {
    username: string;
    role: string;
    permissions?: any;
  };
}

export interface FormErrors {
  username?: string;
  password?: string;
}

export interface TouchedFields {
  username: boolean;
  password: boolean;
}