import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthPayload } from '../middleware/auth';

interface Client {
  ws: WebSocket;
  userId: string;
  isAlive: boolean;
}

const clients: Map<string, Client> = new Map();

export function createWebSocketServer(): WebSocketServer {
  const wss = new WebSocketServer({ port: config.wsPort });

  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token) {
      ws.close(4001, 'Token requis');
      return;
    }

    let payload: AuthPayload;
    try {
      payload = jwt.verify(token, config.jwtSecret) as AuthPayload;
    } catch {
      ws.close(4001, 'Token invalide');
      return;
    }

    const clientId = `${payload.userId}-${Date.now()}`;
    const client: Client = { ws, userId: payload.userId, isAlive: true };
    clients.set(clientId, client);

    console.log(`WebSocket connected: user=${payload.userId}`);

    ws.on('pong', () => {
      client.isAlive = true;
    });

    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        handleMessage(client, message);
      } catch (err) {
        ws.send(JSON.stringify({ type: 'error', message: 'Message invalide' }));
      }
    });

    ws.on('close', () => {
      clients.delete(clientId);
      console.log(`WebSocket disconnected: user=${payload.userId}`);
    });

    ws.send(JSON.stringify({ type: 'connected', clientId }));
  });

  const interval = setInterval(() => {
    for (const [id, client] of clients) {
      if (!client.isAlive) {
        client.ws.terminate();
        clients.delete(id);
        continue;
      }
      client.isAlive = false;
      client.ws.ping();
    }
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  return wss;
}

function handleMessage(client: Client, message: { type: string; payload?: unknown }): void {
  switch (message.type) {
    case 'chat':
      broadcast({ type: 'chat', userId: client.userId, payload: message.payload }, client.userId);
      break;
    case 'broadcast':
      broadcast({ type: 'broadcast', userId: client.userId, payload: message.payload });
      break;
    default:
      client.ws.send(JSON.stringify({ type: 'error', message: 'Type de message inconnu' }));
  }
}

function broadcast(message: unknown, excludeUserId?: string): void {
  for (const [, client] of clients) {
    if (excludeUserId && client.userId === excludeUserId) continue;
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }
}
