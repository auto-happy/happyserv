import fs from 'fs';
import path from 'path';
import { AppConfig } from '../types/index.js';

const DEFAULT_CONFIG: AppConfig = {
  apiUrl: 'http://localhost:3000/api',
  wsUrl: 'ws://localhost:3001',
  deviceName: 'default',
  dataDir: './data',
  logLevel: 'info',
  logDir: './logs',
  syncInterval: 300000,
  telemetryEnabled: false,
  telemetryInterval: 3600000,
  updateCheckInterval: 86400000,
  maxRetries: 3,
  requestTimeout: 30000,
};

export class ConfigManager {
  private config: AppConfig;
  private configPath: string;

  constructor(configPath?: string) {
    this.configPath = configPath || path.resolve(process.cwd(), 'config.json');
    this.config = { ...DEFAULT_CONFIG };
    this.load();
  }

  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  getAll(): AppConfig {
    return { ...this.config };
  }

  set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    this.config[key] = value;
  }

  load(): boolean {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, 'utf-8');
        const parsed = JSON.parse(data) as Partial<AppConfig>;
        this.config = { ...DEFAULT_CONFIG, ...parsed };
        return true;
      }
    } catch (err) {
      console.error('Failed to load config:', err);
    }
    return false;
  }

  save(): boolean {
    try {
      const dir = path.dirname(this.configPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('Failed to save config:', err);
      return false;
    }
  }

  validate(): string[] {
    const errors: string[] = [];
    if (!this.config.apiUrl) errors.push('apiUrl is required');
    if (!this.config.wsUrl) errors.push('wsUrl is required');
    if (this.config.maxRetries < 0) errors.push('maxRetries must be >= 0');
    if (this.config.requestTimeout < 1000) errors.push('requestTimeout must be >= 1000');
    return errors;
  }
}
