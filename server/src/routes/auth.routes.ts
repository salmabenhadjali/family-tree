import { Router } from 'express';
import { register, login, inviteUser, acceptInvite } from '../controllers/auth.controller';
import { protect, requireRole } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/invite', protect, requireRole('admin'), inviteUser);
router.post('/accept-invite', acceptInvite);

export default router;
