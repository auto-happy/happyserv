import fs from 'fs';
import path from 'path';
import { ModuleManifest } from '../types/index.js';

interface ModuleInstance {
  manifest: ModuleManifest;
  exports: Record<string, unknown>;
}

export class ModuleManager {
  private modules: Map<string, ModuleInstance> = new Map();
  private appVersion: string;

  constructor(appVersion: string) {
    this.appVersion = appVersion;
  }

  async loadModule(modulePath: string): Promise<ModuleManifest> {
    const manifestPath = path.resolve(modulePath, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Manifest not found: ${manifestPath}`);
    }

    const manifest: ModuleManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    this.validateManifest(manifest);

    const mainPath = path.resolve(modulePath, manifest.main);
    if (!fs.existsSync(mainPath)) {
      throw new Error(`Main file not found: ${mainPath}`);
    }

    const moduleExports = await import(mainPath);
    const instance: ModuleInstance = { manifest, exports: moduleExports };
    this.modules.set(manifest.name, instance);

    if (typeof moduleExports.init === 'function') {
      await moduleExports.init();
    }

    return manifest;
  }

  unloadModule(name: string): void {
    const instance = this.modules.get(name);
    if (instance && typeof instance.exports.stop === 'function') {
      instance.exports.stop();
    }
    this.modules.delete(name);
  }

  getModule<T = Record<string, unknown>>(name: string): T | null {
    const instance = this.modules.get(name);
    return instance ? (instance.exports as T) : null;
  }

  listModules(): ModuleManifest[] {
    return Array.from(this.modules.values()).map(m => m.manifest);
  }

  async startAll(): Promise<void> {
    for (const [, instance] of this.modules) {
      if (typeof instance.exports.start === 'function') {
        await instance.exports.start();
      }
    }
  }

  async stopAll(): Promise<void> {
    for (const [name, instance] of this.modules) {
      if (typeof instance.exports.stop === 'function') {
        await instance.exports.stop();
      }
    }
    this.modules.clear();
  }

  private validateManifest(manifest: ModuleManifest): void {
    if (!manifest.name || !manifest.version || !manifest.main) {
      throw new Error('Invalid module manifest: name, version, and main are required');
    }

    if (manifest.minAppVersion) {
      const currentParts = this.appVersion.split('.').map(Number);
      const minParts = manifest.minAppVersion.split('.').map(Number);
      for (let i = 0; i < Math.max(currentParts.length, minParts.length); i++) {
        const cur = currentParts[i] || 0;
        const min = minParts[i] || 0;
        if (cur < min) throw new Error(`Module requires app version >= ${manifest.minAppVersion}`);
        if (cur > min) break;
      }
    }
  }
}
