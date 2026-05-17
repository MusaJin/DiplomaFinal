import { Router } from 'express';
import { index, create, update, remove } from './categories.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';

const router = Router();

router.get('/', authMiddleware, index);
router.post('/', authMiddleware, requireRole('ADMIN'), create);
router.patch('/:id', authMiddleware, requireRole('ADMIN'), update);
router.delete('/:id', authMiddleware, requireRole('ADMIN'), remove);

export default router;
