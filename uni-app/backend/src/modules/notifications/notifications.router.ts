import { Router } from 'express';
import { send, registerToken, listNotifications } from './notifications.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';

const router = Router();

router.get('/', authMiddleware, requireRole('ADMIN'), listNotifications);
router.post('/send', authMiddleware, requireRole('ADMIN'), send);
router.post('/register-token', authMiddleware, registerToken);

export default router;
