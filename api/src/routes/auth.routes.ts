import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { query } from '../database';
import { authenticate, AuthPayload } from '../middleware/auth';
import { AuditLog } from '../utils/audit';

const router = Router();

function generateTokens(payload: AuthPayload) {
  const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  const refreshToken = uuidv4();
  return { accessToken, refreshToken };
}

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email et mot de passe requis' });
      return;
    }
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'Email déjà utilisé' });
      return;
    }
    const id = uuidv4();
    await query(
      'INSERT INTO users (id, email, password_hash, name, role) VALUES ($1, $2, $3, $4, $5)',
      [id, email, password, name || '', 'user']
    );
    const payload: AuthPayload = { userId: id, email, role: 'user', permissions: [] };
    const tokens = generateTokens(payload);
    await AuditLog.log({ action: 'USER_REGISTER', userId: id, ip: req.ip });
    res.status(201).json({ user: { id, email, name: name || '' }, ...tokens });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email et mot de passe requis' });
      return;
    }
    const result = await query('SELECT id, email, password_hash, name, role FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      return;
    }
    const user = result.rows[0];
    if (user.password_hash !== password) {
      res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      return;
    }
    const payload: AuthPayload = { userId: user.id, email: user.email, role: user.role, permissions: [] };
    const tokens = generateTokens(payload);
    await AuditLog.log({ action: 'USER_LOGIN', userId: user.id, ip: req.ip });
    res.json({ user: { id: user.id, email: user.email, name: user.name }, ...tokens });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token requis' });
      return;
    }
    const result = await query('SELECT id, email, role FROM users WHERE refresh_token = $1', [refreshToken]);
    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Refresh token invalide' });
      return;
    }
    const user = result.rows[0];
    const payload: AuthPayload = { userId: user.id, email: user.email, role: user.role, permissions: [] };
    const tokens = generateTokens(payload);
    await query('UPDATE users SET refresh_token = $1 WHERE id = $2', [tokens.refreshToken, user.id]);
    res.json(tokens);
  } catch (err) {
    console.error('Refresh error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/logout', authenticate, async (req: Request, res: Response) => {
  try {
    await query('UPDATE users SET refresh_token = NULL WHERE id = $1', [req.user!.userId]);
    await AuditLog.log({ action: 'USER_LOGOUT', userId: req.user!.userId, ip: req.ip });
    res.json({ message: 'Déconnexion réussie' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Email requis' });
      return;
    }
    const result = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      const resetToken = uuidv4();
      await query('UPDATE users SET reset_token = $1 WHERE email = $2', [resetToken, email]);
    }
    res.json({ message: 'Si le email existe, un lien de réinitialisation a été envoyé' });
  } catch (err) {
    console.error('Forgot password error:', err);
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

export default router;
