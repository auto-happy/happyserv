import dns from 'dns/promises';
import https from 'https';
import http from 'http';
import { URL } from 'url';

export interface ConnectivityResult {
  reachable: boolean;
  latencyMs: number;
  error?: string;
}

export function httpRequest(url: string, timeout: number = 10000): Promise<{ status: number; data: string }> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const lib = parsedUrl.protocol === 'https:' ? https : http;

    const req = lib.get(url, { timeout }, (res) => {
      let data = '';
      res.on('data', (chunk: string) => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode || 0, data });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

export async function checkConnectivity(url: string): Promise<ConnectivityResult> {
  const start = Date.now();
  try {
    const { status } = await httpRequest(url, 5000);
    return { reachable: status >= 200 && status < 500, latencyMs: Date.now() - start };
  } catch (err) {
    return { reachable: false, latencyMs: Date.now() - start, error: (err as Error).message };
  }
}

export async function checkDns(hostname: string): Promise<boolean> {
  try {
    await dns.resolve(hostname);
    return true;
  } catch {
    return false;
  }
}

export async function checkConnectivityWithDns(url: string): Promise<ConnectivityResult & { dnsResolved: boolean }> {
  const parsedUrl = new URL(url);
  const dnsResolved = await checkDns(parsedUrl.hostname);
  const connectivity = await checkConnectivity(url);
  return { ...connectivity, dnsResolved };
}
