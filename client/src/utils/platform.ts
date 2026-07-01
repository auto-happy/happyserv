import os from 'os';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface PlatformInfo {
  os: string;
  arch: string;
  version: string;
  hostname: string;
  platform: string;
  release: string;
  isDocker: boolean;
  persistentId: string;
}

let cachedInfo: PlatformInfo | null = null;
let persistentId: string | null = null;

function detectDocker(): boolean {
  try {
    if (fs.existsSync('/.dockerenv')) return true;
    const cgroup = fs.readFileSync('/proc/1/cgroup', 'utf-8');
    return cgroup.includes('docker');
  } catch {
    return false;
  }
}

function getPersistentId(dataDir: string): string {
  if (persistentId) return persistentId;

  const idPath = path.resolve(dataDir, '.device-id');
  try {
    if (fs.existsSync(idPath)) {
      persistentId = fs.readFileSync(idPath, 'utf-8').trim();
      return persistentId!;
    }
  } catch {
    // generate new
  }

  persistentId = uuidv4();
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(idPath, persistentId, 'utf-8');
  } catch {
    // ignore
  }

  return persistentId;
}

export function getPlatformInfo(dataDir: string = './data'): PlatformInfo {
  if (cachedInfo) return cachedInfo;

  cachedInfo = {
    os: os.type(),
    arch: os.arch(),
    version: os.version(),
    hostname: os.hostname(),
    platform: os.platform(),
    release: os.release(),
    isDocker: detectDocker(),
    persistentId: getPersistentId(dataDir),
  };

  return cachedInfo;
}
