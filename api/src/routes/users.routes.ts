import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../database';
import { authenticate, requireRole } from '../middleware/auth';
import { AuditLog } from '../utils/audit';

const router = Router();

router.get('/', authenticate, requireRole('admin'), async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT id, email, name, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/:id', authenticate, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT id, email, name, role, is_active, created_at, updated_at FROM users WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/', authenticate, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email et mot de passe requis' });
      return;
    }
    const id = uuidv4();
    await query(
      'INSERT INTO users (id, email, password_hash, name, role) VALUES ($1, $2, $3, $4, $5)',
      [id, email, password, name || '', role || 'user']
    );
    await AuditLog.log({ action: 'ADMIN_CREATE_USER', userId: req.user!.userId, resourceType: 'user', resourceId: id });
    res.status(201).json({ id, email, name: name || '', role: role || 'user' });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.put('/:id', authenticate, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { name, role, is_active } = req.body;
    const result = await query(
      'UPDATE users SET name = COALESCE($1, name), role = COALESCE($2, role), is_active = COALESCE($3, is_active) WHERE id = $4 RETURNING id, email, name, role, is_active',
      [name, role, is_active, req.params.id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }
    await AuditLog.log({ action: 'ADMIN_UPDATE_USER', userId: req.user!.userId, resourceType: 'user', resourceId: req.params.id });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete('/:id', authenticate, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }
    await AuditLog.log({ action: 'ADMIN_DELETE_USER', userId: req.user!.userId, resourceType: 'user', resourceId: req.params.id });
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT id, email, name, role, created_at FROM users WHERE id = $1', [req.user!.userId]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.put('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const result = await query(
      'UPDATE users SET name = COALESCE($1, name) WHERE id = $2 RETURNING id, email, name, role',
      [name, req.user!.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update me error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
