import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../database';
import { authenticate, requireRole } from '../middleware/auth';
import { AuditLog } from '../utils/audit';

const router = Router();

router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT l.*, u.email as user_email FROM licenses l JOIN users u ON l.user_id = u.id WHERE l.user_id = $1 ORDER BY l.created_at DESC',
      [req.user!.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get licenses error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT l.*, u.email as user_email FROM licenses l JOIN users u ON l.user_id = u.id WHERE l.id = $1 AND (l.user_id = $2 OR $3 = true)',
      [req.params.id, req.user!.userId, req.user!.role === 'admin']
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Licence non trouvée' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get license error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { licenseType, maxDevices } = req.body;
    const id = uuidv4();
    const licenseKey = 'HS-' + uuidv4().replace(/-/g, '').toUpperCase().substring(0, 20);
    await query(
      'INSERT INTO licenses (id, user_id, license_key, license_type, max_devices) VALUES ($1, $2, $3, $4, $5)',
      [id, req.user!.userId, licenseKey, licenseType || 'basic', maxDevices || 1]
    );
    await AuditLog.log({ action: 'LICENSE_CREATE', userId: req.user!.userId, resourceType: 'license', resourceId: id });
    res.status(201).json({ id, licenseKey, licenseType: licenseType || 'basic', maxDevices: maxDevices || 1 });
  } catch (err) {
    console.error('Create license error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.put('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { licenseType, maxDevices } = req.body;
    const result = await query(
      'UPDATE licenses SET license_type = COALESCE($1, license_type), max_devices = COALESCE($2, max_devices) WHERE id = $3 AND user_id = $4 RETURNING *',
      [licenseType, maxDevices, req.params.id, req.user!.userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Licence non trouvée' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update license error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const result = await query('DELETE FROM licenses WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.user!.userId]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Licence non trouvée' });
      return;
    }
    await AuditLog.log({ action: 'LICENSE_DELETE', userId: req.user!.userId, resourceType: 'license', resourceId: req.params.id });
    res.json({ message: 'Licence supprimée' });
  } catch (err) {
    console.error('Delete license error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/validate', authenticate, async (req: Request, res: Response) => {
  try {
    const { licenseKey, fingerprint } = req.body;
    if (!licenseKey) {
      res.status(400).json({ error: 'Clé de licence requise' });
      return;
    }
    const result = await query(
      'SELECT l.* FROM licenses l WHERE l.license_key = $1 AND l.status = $2',
      [licenseKey, 'active']
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Licence invalide ou expirée' });
      return;
    }
    const license = result.rows[0];
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      res.status(410).json({ error: 'Licence expirée' });
      return;
    }
    if (fingerprint) {
      const deviceCount = await query('SELECT COUNT(*) as count FROM devices WHERE license_id = $1 AND is_revoked = false', [license.id]);
      if (parseInt(deviceCount.rows[0].count) >= license.max_devices) {
        res.status(403).json({ error: 'Nombre maximum d\'appareils atteint' });
        return;
      }
    }
    await AuditLog.log({ action: 'LICENSE_VALIDATE', userId: req.user!.userId, resourceType: 'license', resourceId: license.id });
    res.json({ valid: true, license });
  } catch (err) {
    console.error('Validate license error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/:id/revoke', authenticate, async (req: Request, res: Response) => {
  try {
    const result = await query(
      'UPDATE licenses SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      ['revoked', req.params.id, req.user!.userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Licence non trouvée' });
      return;
    }
    await AuditLog.log({ action: 'LICENSE_REVOKE', userId: req.user!.userId, resourceType: 'license', resourceId: req.params.id });
    res.json({ message: 'Licence révoquée' });
  } catch (err) {
    console.error('Revoke license error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
