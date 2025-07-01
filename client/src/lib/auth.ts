import { apiRequest } from "./queryClient";
import type { User, LoginRequest, InsertUser } from "@shared/schema";

export interface AuthUser extends Omit<User, 'password'> {}

export interface AuthResponse {
  user: AuthUser;
}

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const res = await apiRequest("POST", "/api/auth/login", credentials);
  return res.json();
}

export async function signup(userData: InsertUser): Promise<AuthResponse> {
  const res = await apiRequest("POST", "/api/auth/signup", userData);
  return res.json();
}

export function getStoredUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem('ucova_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function storeUser(user: AuthUser): void {
  localStorage.setItem('ucova_user', JSON.stringify(user));
}

export function clearStoredUser(): void {
  localStorage.removeItem('ucova_user');
}
