import fs from 'fs';
import path from 'path';
import { AuthSession } from '../types/index.js';

export class AuthManager {
  private session: AuthSession | null = null;
  private tokenPath: string;

  constructor(dataDir: string) {
    this.tokenPath = path.resolve(dataDir, 'session.json');
    this.loadToken();
  }

  getSession(): AuthSession | null {
    return this.session;
  }

  isAuthenticated(): boolean {
    if (!this.session) return false;
    if (Date.now() >= this.session.expiresAt) return false;
    return true;
  }

  async login(apiUrl: string, email: string, password: string): Promise<AuthSession> {
    const res = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    const data = await res.json();
    this.session = {
      userId: data.user.id,
      email: data.user.email,
      name: data.user.name || '',
      role: data.user.role || 'user',
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: Date.now() + 15 * 60 * 1000,
    };
    this.saveToken();
    return this.session;
  }

  async register(apiUrl: string, email: string, password: string, name?: string): Promise<AuthSession> {
    const res = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    const data = await res.json();
    this.session = {
      userId: data.user.id,
      email: data.user.email,
      name: data.user.name || '',
      role: 'user',
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: Date.now() + 15 * 60 * 1000,
    };
    this.saveToken();
    return this.session;
  }

  async refreshToken(apiUrl: string): Promise<boolean> {
    if (!this.session) return false;
    try {
      const res = await fetch(`${apiUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.session.refreshToken }),
      });
      if (!res.ok) {
        this.logout();
        return false;
      }
      const data = await res.json();
      this.session.accessToken = data.accessToken;
      this.session.refreshToken = data.refreshToken;
      this.session.expiresAt = Date.now() + 15 * 60 * 1000;
      this.saveToken();
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  logout(): void {
    this.session = null;
    try {
      if (fs.existsSync(this.tokenPath)) {
        fs.unlinkSync(this.tokenPath);
      }
    } catch {
      // ignore
    }
  }

  private loadToken(): void {
    try {
      if (fs.existsSync(this.tokenPath)) {
        const data = fs.readFileSync(this.tokenPath, 'utf-8');
        this.session = JSON.parse(data) as AuthSession;
      }
    } catch {
      this.session = null;
    }
  }

  private saveToken(): void {
    try {
      const dir = path.dirname(this.tokenPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.tokenPath, JSON.stringify(this.session), 'utf-8');
    } catch (err) {
      console.error('Failed to save session:', err);
    }
  }
}
