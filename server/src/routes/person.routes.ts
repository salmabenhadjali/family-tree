import { Router } from 'express';
import multer from 'multer';
import { protect, requireRole } from '../middleware/auth';
import * as pc from '../controllers/person.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.use(protect);

router.get('/search', pc.search);
router.get('/', pc.getAll);
router.get('/:id', pc.getOne);
router.post('/', requireRole('admin', 'editor'), upload.single('photo'), pc.create);
router.patch('/:id', requireRole('admin', 'editor'), upload.single('photo'), pc.update);
router.delete('/:id', requireRole('admin'), pc.remove);

export default router;
