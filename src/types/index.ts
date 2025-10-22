export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  avatarUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  VETERINARIAN = 'veterinarian',
  NURSE = 'nurse',
  RECEPTIONIST = 'receptionist',
  MANAGER = 'manager',
  STAFF = 'staff',
  USER = 'user'
}

export interface Service {
  id: string;
  name: string;
  url: string;
  port: number;
  status: ServiceStatus;
  description: string;
  icon: string;
  category: ServiceCategory;
  healthEndpoint?: string;
  lastChecked?: Date;
  responseTime?: number;
  version?: string;
}

export enum ServiceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ERROR = 'error',
  CHECKING = 'checking'
}

export enum ServiceCategory {
  AUTHENTICATION = 'authentication',
  HEALTHCARE = 'healthcare',
  MANAGEMENT = 'management',
  FINANCIAL = 'financial',
  HR = 'hr',
  DOCUMENTATION = 'documentation',
  OTHER = 'other'
}

export interface ServiceHealth {
  status: ServiceStatus;
  timestamp: Date;
  responseTime: number;
  version?: string;
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterRequest) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface DashboardStats {
  totalServices: number;
  onlineServices: number;
  offlineServices: number;
  errorServices: number;
  avgResponseTime: number;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  category: string;
}