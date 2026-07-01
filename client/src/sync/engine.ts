import { ApiClient } from '../api/client.js';
import { SyncState } from '../types/index.js';

interface SyncQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  resource: string;
  data: unknown;
  timestamp: number;
}

export class SyncEngine {
  private api: ApiClient;
  private queue: SyncQueueItem[] = [];
  private state: SyncState;
  private syncTimer: ReturnType<typeof setInterval> | null = null;

  constructor(api: ApiClient, syncInterval: number = 300000) {
    this.api = api;
    this.state = {
      lastSyncAt: null,
      pendingChanges: 0,
      conflicts: 0,
      status: 'idle',
    };

    if (syncInterval > 0) {
      this.syncTimer = setInterval(() => this.sync(), syncInterval);
    }
  }

  getState(): SyncState {
    return { ...this.state };
  }

  enqueue(action: SyncQueueItem['action'], resource: string, data: unknown): void {
    this.queue.push({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      action,
      resource,
      data,
      timestamp: Date.now(),
    });
    this.state.pendingChanges = this.queue.length;
  }

  async sync(): Promise<boolean> {
    if (this.state.status === 'syncing') return false;

    this.state.status = 'syncing';

    try {
      while (this.queue.length > 0) {
        const item = this.queue[0];
        try {
          switch (item.action) {
            case 'create':
              await this.api.post(item.resource, item.data);
              break;
            case 'update':
              await this.api.put(item.resource, item.data);
              break;
            case 'delete':
              await this.api.delete(item.resource);
              break;
          }
          this.queue.shift();
        } catch (err) {
          console.error('Sync failed for item:', item.id, err);
          this.state.conflicts++;
          this.queue.shift();
        }
      }

      this.state.lastSyncAt = new Date().toISOString();
      this.state.pendingChanges = this.queue.length;
      this.state.status = 'idle';
      return true;
    } catch (err) {
      this.state.status = 'error';
      console.error('Sync error:', err);
      return false;
    }
  }

  async syncNow(): Promise<boolean> {
    return this.sync();
  }

  stop(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  resolveConflicts(strategy: 'local-wins' | 'remote-wins' | 'last-write-wins' = 'last-write-wins'): void {
    if (strategy === 'last-write-wins') {
      this.queue.sort((a, b) => a.timestamp - b.timestamp);
    }
  }
}
