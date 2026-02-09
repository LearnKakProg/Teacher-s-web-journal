import { Router } from 'express';
import { listTrimesters, addTrimestre, editTrimestre, deleteTrimestre } from '../controllers/trimestreController.js';
import auth from '../middleware/auth.js';
import roles from '../middleware/roles.js';

const router = Router();

router.get('/', auth, listTrimesters);
router.post('/', auth, roles('admin'), addTrimestre);
router.put('/:id', auth, roles('admin'), editTrimestre);
router.delete('/:id', auth, roles('admin'), deleteTrimestre);

export default router;