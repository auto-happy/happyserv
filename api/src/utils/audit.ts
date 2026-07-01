import fs from 'fs';
import path from 'path';

const LOG_DIR = path.resolve(__dirname, '../../logs');
const LOG_FILE = path.join(LOG_DIR, 'audit.log');

function ensureLogDir(): void {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

export class AuditLog {
  static async log(params: {
    action: string;
    userId?: string;
    ip?: string;
    resourceType?: string;
    resourceId?: string;
    details?: Record<string, unknown>;
  }): Promise<void> {
    const entry = {
      timestamp: new Date().toISOString(),
      action: params.action,
      userId: params.userId || null,
      ip: params.ip || null,
      resourceType: params.resourceType || null,
      resourceId: params.resourceId || null,
      details: params.details || null,
    };

    console.log('[AUDIT]', JSON.stringify(entry));

    try {
      ensureLogDir();
      fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n', 'utf-8');
    } catch (err) {
      console.error('Failed to write audit log:', err);
    }
  }
}
