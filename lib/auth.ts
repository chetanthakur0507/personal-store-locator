// Simple Authentication Context (Client-side)
// In production, use NextAuth.js or similar

export interface AuthUser {
  id: string;
  username: string;
  role: 'admin' | 'user';
  name: string;
}

const AUTH_KEY = 'store_auth_user';

export function setAuthUser(user: AuthUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }
}

export function getAuthUser(): AuthUser | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
}

export function clearAuthUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === 'admin';
}

export function isAuthenticated(): boolean {
  return getAuthUser() !== null;
}
