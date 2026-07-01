import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { ConfigManager } from '../src/config/index.js';

const TEST_DIR = path.join(os.tmpdir(), 'happyserv-test-' + Date.now());

describe('ConfigManager', () => {
  let configPath: string;

  beforeEach(() => {
    fs.mkdirSync(TEST_DIR, { recursive: true });
    configPath = path.join(TEST_DIR, 'config.json');
  });

  afterEach(() => {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it('should load default config when no file exists', () => {
    const cm = new ConfigManager(configPath);
    expect(cm.get('apiUrl')).toBe('http://localhost:3000/api');
    expect(cm.get('maxRetries')).toBe(3);
    expect(cm.get('requestTimeout')).toBe(30000);
  });

  it('should save and load config', () => {
    const cm = new ConfigManager(configPath);
    cm.set('apiUrl', 'https://api.example.com');
    cm.set('maxRetries', 5);
    expect(cm.save()).toBe(true);

    const cm2 = new ConfigManager(configPath);
    expect(cm2.get('apiUrl')).toBe('https://api.example.com');
    expect(cm2.get('maxRetries')).toBe(5);
  });

  it('should merge saved config with defaults', () => {
    fs.writeFileSync(configPath, JSON.stringify({ apiUrl: 'https://custom.api' }));
    const cm = new ConfigManager(configPath);
    expect(cm.get('apiUrl')).toBe('https://custom.api');
    expect(cm.get('maxRetries')).toBe(3);
  });

  it('should validate config', () => {
    const cm = new ConfigManager(configPath);
    expect(cm.validate()).toHaveLength(0);

    cm.set('apiUrl', '');
    const errors = cm.validate();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.includes('apiUrl'))).toBe(true);
  });

  it('should return all config', () => {
    const cm = new ConfigManager(configPath);
    const all = cm.getAll();
    expect(all.apiUrl).toBe('http://localhost:3000/api');
    expect(all.syncInterval).toBe(300000);
  });
});
