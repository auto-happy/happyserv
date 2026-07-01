import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { ApiClient } from '../api/client.js';
import { UpdateInfo } from '../types/index.js';

export class UpdateManager {
  private api: ApiClient;
  private currentVersion: string;
  private platform: string;
  private updateCheckTimer: ReturnType<typeof setInterval> | null = null;

  constructor(api: ApiClient, currentVersion: string, platform: string, checkInterval: number = 86400000) {
    this.api = api;
    this.currentVersion = currentVersion;
    this.platform = platform;

    if (checkInterval > 0) {
      this.updateCheckTimer = setInterval(() => this.checkForUpdates(), checkInterval);
    }
  }

  async checkForUpdates(): Promise<UpdateInfo> {
    try {
      const result = await this.api.get<UpdateInfo>('/updates/check', {
        params: { currentVersion: this.currentVersion, platform: this.platform },
      });
      return result;
    } catch (err) {
      console.error('Update check failed:', err);
      return { updateAvailable: false };
    }
  }

  async downloadUpdate(fileUrl: string, destPath: string): Promise<string> {
    const res = await fetch(fileUrl);
    if (!res.ok) throw new Error(`Download failed: ${res.statusText}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(destPath, buffer);
    return destPath;
  }

  verifyChecksum(filePath: string, expectedSha256: string): boolean {
    const fileBuffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    return hash === expectedSha256;
  }

  compareVersions(a: string, b: string): number {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      const na = pa[i] || 0;
      const nb = pb[i] || 0;
      if (na > nb) return 1;
      if (na < nb) return -1;
    }
    return 0;
  }

  stop(): void {
    if (this.updateCheckTimer) {
      clearInterval(this.updateCheckTimer);
      this.updateCheckTimer = null;
    }
  }
}
