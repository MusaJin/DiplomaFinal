import { Router } from 'express';
import { getUsers } from './users.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';

const router = Router();

router.get('/', authMiddleware, requireRole('ADMIN'), getUsers);

export default router;
