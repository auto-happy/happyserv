import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../database';
import { authenticate } from '../middleware/auth';
import { AuditLog } from '../utils/audit';

const router = Router();

router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT d.*, l.license_key FROM devices d LEFT JOIN licenses l ON d.license_id = l.id WHERE d.user_id = $1 ORDER BY d.created_at DESC',
      [req.user!.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get devices error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/register', authenticate, async (req: Request, res: Response) => {
  try {
    const { deviceName, deviceType, fingerprint } = req.body;
    if (!deviceName || !fingerprint) {
      res.status(400).json({ error: 'Nom et empreinte requis' });
      return;
    }
    const existing = await query('SELECT id FROM devices WHERE fingerprint = $1 AND user_id = $2 AND is_revoked = false', [fingerprint, req.user!.userId]);
    if (existing.rows.length > 0) {
      await query('UPDATE devices SET last_seen_at = NOW() WHERE id = $1', [existing.rows[0].id]);
      res.json({ message: 'Appareil déjà enregistré', deviceId: existing.rows[0].id });
      return;
    }
    const id = uuidv4();
    await query(
      'INSERT INTO devices (id, user_id, device_name, device_type, fingerprint) VALUES ($1, $2, $3, $4, $5)',
      [id, req.user!.userId, deviceName, deviceType || null, fingerprint]
    );
    await AuditLog.log({ action: 'DEVICE_REGISTER', userId: req.user!.userId, resourceType: 'device', resourceId: id });
    res.status(201).json({ id, deviceName, deviceType, fingerprint });
  } catch (err) {
    console.error('Register device error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/:id/revoke', authenticate, async (req: Request, res: Response) => {
  try {
    const result = await query(
      'UPDATE devices SET is_revoked = true WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user!.userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Appareil non trouvé' });
      return;
    }
    await AuditLog.log({ action: 'DEVICE_REVOKE', userId: req.user!.userId, resourceType: 'device', resourceId: req.params.id });
    res.json({ message: 'Appareil révoqué' });
  } catch (err) {
    console.error('Revoke device error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
