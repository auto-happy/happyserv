import { ServiceStatus } from '@/types'

const services: ServiceStatus[] = [
  {
    name: 'API',
    status: 'operational',
    uptime: 99.97,
    lastIncident: null,
  },
  {
    name: 'WebSocket',
    status: 'operational',
    uptime: 99.95,
    lastIncident: null,
  },
  {
    name: 'Base de données',
    status: 'operational',
    uptime: 99.99,
    lastIncident: null,
  },
  {
    name: 'CDN',
    status: 'operational',
    uptime: 99.89,
    lastIncident: '2024-06-10 14:32',
  },
  {
    name: 'Email',
    status: 'degraded',
    uptime: 98.50,
    lastIncident: '2024-06-28 09:15',
  },
]

export function getServiceStatuses(): ServiceStatus[] {
  return services
}
