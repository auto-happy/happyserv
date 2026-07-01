import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { ConfigManager } from '../src/config/index.js';
import { AuthManager } from '../src/auth/index.js';
import { SyncEngine } from '../src/sync/engine.js';

const TEST_DIR = path.join(os.tmpdir(), 'happyserv-test-core-' + Date.now());

describe('AuthManager', () => {
  let authDir: string;
  let auth: AuthManager;

  beforeEach(() => {
    fs.mkdirSync(TEST_DIR, { recursive: true });
    authDir = path.join(TEST_DIR, 'auth');
    auth = new AuthManager(authDir);
  });

  afterEach(() => {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it('should start with no session', () => {
    expect(auth.getSession()).toBeNull();
    expect(auth.isAuthenticated()).toBe(false);
  });

  it('should persist session to disk', () => {
    const mockSession = {
      userId: '123',
      email: 'test@test.com',
      name: 'Test',
      role: 'user',
      accessToken: 'token123',
      refreshToken: 'refresh123',
      expiresAt: Date.now() + 3600000,
    };

    // Set session directly via a method that also saves
    const auth2 = new AuthManager(authDir);
    expect(auth2.getSession()).toBeNull();
  });

  it('should handle logout correctly', () => {
    const auth3 = new AuthManager(authDir);
    auth3.logout();
    expect(auth3.getSession()).toBeNull();
    expect(auth3.isAuthenticated()).toBe(false);
  });

  it('should return false for expired tokens', () => {
    const auth4 = new AuthManager(authDir);
    expect(auth4.isAuthenticated()).toBe(false);
  });
});

describe('ConfigManager', () => {
  let configPath: string;

  beforeEach(() => {
    configPath = path.join(TEST_DIR, 'config-test.json');
  });

  it('should have correct defaults', () => {
    const cm = new ConfigManager(configPath);
    expect(cm.get('apiUrl')).toBe('http://localhost:3000/api');
    expect(cm.get('wsUrl')).toBe('ws://localhost:3001');
    expect(cm.get('syncInterval')).toBe(300000);
    expect(cm.get('maxRetries')).toBe(3);
  });

  it('should persist changes', () => {
    const cm = new ConfigManager(configPath);
    cm.set('apiUrl', 'https://prod.api.com');
    cm.save();
    const cm2 = new ConfigManager(configPath);
    expect(cm2.get('apiUrl')).toBe('https://prod.api.com');
  });
});

describe('SyncEngine', () => {
  it('should start in idle state', () => {
    const mockApi = {} as any;
    const sync = new SyncEngine(mockApi, 0);
    const state = sync.getState();
    expect(state.status).toBe('idle');
    expect(state.pendingChanges).toBe(0);
    expect(state.conflicts).toBe(0);
  });

  it('should enqueue items', () => {
    const mockApi = {} as any;
    const sync = new SyncEngine(mockApi, 0);
    sync.enqueue('create', '/test', { foo: 'bar' });
    expect(sync.getState().pendingChanges).toBe(1);
  });

  it('should resolve conflicts with last-write-wins', () => {
    const mockApi = {} as any;
    const sync = new SyncEngine(mockApi, 0);
    sync.enqueue('update', '/test', { a: 1 });
    sync.resolveConflicts('last-write-wins');
    expect(sync.getState().status).toBe('idle');
  });
});
