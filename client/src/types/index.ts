export interface AppConfig {
  apiUrl: string;
  wsUrl: string;
  deviceName: string;
  dataDir: string;
  logLevel: string;
  logDir: string;
  syncInterval: number;
  telemetryEnabled: boolean;
  telemetryInterval: number;
  updateCheckInterval: number;
  maxRetries: number;
  requestTimeout: number;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface SyncState {
  lastSyncAt: string | null;
  pendingChanges: number;
  conflicts: number;
  status: 'idle' | 'syncing' | 'error';
}

export interface UpdateInfo {
  updateAvailable: boolean;
  version?: string;
  fileUrl?: string;
  checksumSha256?: string;
  fileSize?: number;
  changelog?: string;
  isMandatory?: boolean;
}

export interface ModuleManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  main: string;
  minAppVersion: string;
  maxAppVersion?: string;
  permissions: string[];
}

export interface TelemetryEvent {
  event: string;
  timestamp: string;
  properties?: Record<string, unknown>;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  module?: string;
  details?: Record<string, unknown>;
}
