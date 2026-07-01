import fs from 'fs';
import path from 'path';
import { TelemetryEvent } from '../types/index.js';

export class Telemetry {
  private enabled: boolean;
  private buffer: TelemetryEvent[] = [];
  private flushInterval: ReturnType<typeof setInterval> | null = null;
  private apiUrl: string;
  private bufferPath: string;
  private maxBufferSize: number = 100;

  constructor(apiUrl: string, dataDir: string, enabled: boolean = false, flushIntervalMs: number = 3600000) {
    this.apiUrl = apiUrl;
    this.bufferPath = path.resolve(dataDir, 'telemetry-buffer.json');
    this.enabled = enabled;
    this.loadBuffer();

    if (enabled) {
      this.flushInterval = setInterval(() => this.flush(), flushIntervalMs);
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (enabled && !this.flushInterval) {
      this.flushInterval = setInterval(() => this.flush(), 3600000);
    } else if (!enabled && this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  track(event: string, properties?: Record<string, unknown>): void {
    if (!this.enabled) return;

    const sanitized = this.sanitize(properties);
    this.buffer.push({
      event,
      timestamp: new Date().toISOString(),
      properties: sanitized,
    });

    if (this.buffer.length >= this.maxBufferSize) {
      this.flush();
    } else {
      this.saveBuffer();
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const events = [...this.buffer];
    this.buffer = [];
    this.saveBuffer();

    try {
      await fetch(`${this.apiUrl}/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      });
    } catch {
      this.buffer.unshift(...events);
      this.saveBuffer();
    }
  }

  private sanitize(properties?: Record<string, unknown>): Record<string, unknown> | undefined {
    if (!properties) return undefined;
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(properties)) {
      if (key.toLowerCase().includes('password') || key.toLowerCase().includes('token') || key.toLowerCase().includes('secret')) {
        continue;
      }
      if (typeof value === 'string' && value.length > 500) {
        sanitized[key] = value.substring(0, 500);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  private loadBuffer(): void {
    try {
      if (fs.existsSync(this.bufferPath)) {
        const data = fs.readFileSync(this.bufferPath, 'utf-8');
        this.buffer = JSON.parse(data);
      }
    } catch {
      this.buffer = [];
    }
  }

  private saveBuffer(): void {
    try {
      fs.writeFileSync(this.bufferPath, JSON.stringify(this.buffer), 'utf-8');
    } catch {
      // ignore
    }
  }

  stop(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    this.flush();
  }
}
