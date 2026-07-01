# Planning de Maintenance

## Quotidienne

| Horaire | Tâche | Script | Durée |
|---------|-------|--------|-------|
| 00:00 | Backup DB quotidien | backup.sh (daily) | 5 min |
| Toutes les 5 min | Health check | health-check.sh | 10s |
| Continu | Auto-réparation | auto-repair.sh | 30s |
| 08:00 | Rapport quotidien | generate-report.sh (daily) | 2 min |

## Hebdomadaire

| Jour | Horaire | Tâche | Durée |
|------|---------|-------|-------|
| Dimanche | 03:00 | Backup hebdo complet | 30 min |
| Dimanche | 04:00 | Vérification certificats SSL | 5 min |
| Dimanche | 04:30 | Nettoyage logs anciens | 10 min |
| Lundi | 08:00 | Rapport hebdo | 5 min |

## Mensuelle

| Jour | Tâche | Durée |
|------|-------|-------|
| 1er du mois | Backup mensuel complet | 1h |
| 1er du mois | Rotation des logs | 15 min |
| 1er du mois | Audit de sécurité | 30 min |
| 1er du mois | Vérification mises à jour disponibles | 10 min |
| 1er du mois | Rapport mensuel | 10 min |

## Trimestrielle

| Tâche | Durée |
|-------|-------|
| Test complet de restauration | 2h |
| Mise à jour majeure des dépendances | 1h |
| Revue des performances | 30 min |
| Mise à jour documentation | 1h |

## Annuelle

| Tâche | Durée |
|-------|-------|
| Renouvellement domaine (si applicable) | 15 min |
| Audit de sécurité complet | 4h |
| Test de reprise après sinistre (PRA) | 4h |
| Revue des accès utilisateurs | 30 min |
