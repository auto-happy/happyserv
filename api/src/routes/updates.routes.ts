import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../database';
import { authenticate, requireRole } from '../middleware/auth';
import { AuditLog } from '../utils/audit';

const router = Router();

router.get('/check', authenticate, async (req: Request, res: Response) => {
  try {
    const { currentVersion, platform } = req.query;
    if (!currentVersion || !platform) {
      res.status(400).json({ error: 'Version actuelle et plateforme requis' });
      return;
    }
    const result = await query(
      'SELECT * FROM app_versions WHERE platform = $1 AND is_published = true ORDER BY created_at DESC LIMIT 1',
      [platform]
    );
    if (result.rows.length === 0) {
      res.json({ updateAvailable: false });
      return;
    }
    const latest = result.rows[0];
    const hasUpdate = latest.version !== currentVersion;
    res.json({
      updateAvailable: hasUpdate,
      version: latest.version,
      fileUrl: latest.file_url,
      checksumSha256: latest.checksum_sha256,
      fileSize: latest.file_size,
      changelog: latest.changelog,
      isMandatory: latest.is_mandatory,
    });
  } catch (err) {
    console.error('Check update error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/publish', authenticate, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { version, platform, fileUrl, checksumSha256, fileSize, changelog, isMandatory } = req.body;
    if (!version || !platform || !fileUrl || !checksumSha256 || !fileSize) {
      res.status(400).json({ error: 'Tous les champs requis' });
      return;
    }
    const id = uuidv4();
    await query(
      'INSERT INTO app_versions (id, version, platform, file_url, checksum_sha256, file_size, changelog, is_mandatory, is_published, published_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, $9)',
      [id, version, platform, fileUrl, checksumSha256, fileSize, changelog || null, isMandatory || false, req.user!.userId]
    );
    await AuditLog.log({ action: 'VERSION_PUBLISH', userId: req.user!.userId, resourceType: 'app_version', resourceId: id });
    res.status(201).json({ id, version, platform });
  } catch (err) {
    console.error('Publish update error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
