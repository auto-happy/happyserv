import fs from 'fs';
import path from 'path';
import { LogEntry } from '../types/index.js';

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
type LogLevel = (typeof LOG_LEVELS)[number];

const LEVEL_RANK: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export class Logger {
  private logDir: string;
  private minLevel: LogLevel;
  private maxFileSize: number;
  private currentFileSize: number = 0;

  constructor(logDir: string, minLevel: LogLevel = 'info', maxFileSize: number = 5 * 1024 * 1024) {
    this.logDir = logDir;
    this.minLevel = minLevel;
    this.maxFileSize = maxFileSize;
    this.ensureDir();
    this.currentFileSize = this.getCurrentFileSize();
  }

  debug(message: string, details?: Record<string, unknown>): void {
    this.log('debug', message, details);
  }

  info(message: string, details?: Record<string, unknown>): void {
    this.log('info', message, details);
  }

  warn(message: string, details?: Record<string, unknown>): void {
    this.log('warn', message, details);
  }

  error(message: string, details?: Record<string, unknown>): void {
    this.log('error', message, details);
  }

  private log(level: LogLevel, message: string, details?: Record<string, unknown>): void {
    if (LEVEL_RANK[level] < LEVEL_RANK[this.minLevel]) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(details ? { details } : {}),
    };

    const formatted = JSON.stringify(entry);
    console.log(formatted);

    this.writeToFile(formatted + '\n');
  }

  private writeToFile(line: string): void {
    try {
      const filePath = this.getLogFilePath();
      if (this.currentFileSize + line.length > this.maxFileSize) {
        this.rotate();
      }
      fs.appendFileSync(filePath, line, 'utf-8');
      this.currentFileSize += Buffer.byteLength(line, 'utf-8');
    } catch (err) {
      console.error('Failed to write log file:', err);
    }
  }

  private rotate(): void {
    const filePath = this.getLogFilePath();
    if (fs.existsSync(filePath)) {
      const rotatedPath = filePath.replace('.log', `-${Date.now()}.log`);
      fs.renameSync(filePath, rotatedPath);
    }
    this.currentFileSize = 0;
  }

  private getLogFilePath(): string {
    const date = new Date().toISOString().split('T')[0];
    return path.join(this.logDir, `app-${date}.log`);
  }

  private getCurrentFileSize(): number {
    try {
      const filePath = this.getLogFilePath();
      if (fs.existsSync(filePath)) {
        return fs.statSync(filePath).size;
      }
    } catch {
      // ignore
    }
    return 0;
  }

  private ensureDir(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }
}
