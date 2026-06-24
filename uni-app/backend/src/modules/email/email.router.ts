import { Router } from 'express';
import { send } from './email.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';

const router = Router();

router.post('/send', authMiddleware, requireRole('ADMIN'), send);

export default router;
