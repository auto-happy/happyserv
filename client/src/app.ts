import { ConfigManager } from './config/index.js';
import { AuthManager } from './auth/index.js';
import { ApiClient } from './api/client.js';
import { WebSocketClient } from './api/websocket.js';
import { SyncEngine } from './sync/engine.js';
import { UpdateManager } from './updates/index.js';
import { Logger } from './logger/index.js';
import { Telemetry } from './telemetry/index.js';
import { ModuleManager } from './modules/index.js';
import { getPlatformInfo } from './utils/platform.js';

export const APP_VERSION = '1.0.0';

export class App {
  public config: ConfigManager;
  public auth: AuthManager;
  public api: ApiClient;
  public ws: WebSocketClient;
  public sync: SyncEngine;
  public updates: UpdateManager;
  public logger: Logger;
  public telemetry: Telemetry;
  public modules: ModuleManager;
  private running = false;

  constructor() {
    this.config = new ConfigManager();
    this.logger = new Logger(this.config.get('logDir'), this.config.get('logLevel') as any);
    this.auth = new AuthManager(this.config.get('dataDir'));
    this.api = new ApiClient(this.auth, this.config.get('apiUrl'), this.config.get('maxRetries'), this.config.get('requestTimeout'));
    this.ws = new WebSocketClient(this.config.get('wsUrl'), this.auth);
    this.sync = new SyncEngine(this.api, this.config.get('syncInterval'));
    this.updates = new UpdateManager(this.api, APP_VERSION, getPlatformInfo(this.config.get('dataDir')).platform, this.config.get('updateCheckInterval'));
    this.telemetry = new Telemetry(this.config.get('apiUrl'), this.config.get('dataDir'), this.config.get('telemetryEnabled'), this.config.get('telemetryInterval'));
    this.modules = new ModuleManager(APP_VERSION);
  }

  async start(): Promise<void> {
    this.logger.info('Application starting', { version: APP_VERSION });
    this.running = true;

    if (this.auth.isAuthenticated()) {
      this.ws.connect();
    }

    this.telemetry.track('app_start', { version: APP_VERSION });
    this.logger.info('Application started');
  }

  async stop(): Promise<void> {
    this.logger.info('Application stopping');
    this.running = false;

    this.sync.stop();
    this.updates.stop();
    this.telemetry.stop();
    this.ws.disconnect();
    await this.modules.stopAll();

    this.logger.info('Application stopped');
  }

  isRunning(): boolean {
    return this.running;
  }
}
