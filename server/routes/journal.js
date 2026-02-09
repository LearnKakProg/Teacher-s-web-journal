import { Router } from 'express';
import auth from '../middleware/auth.js';
import roles from '../middleware/roles.js';
import { getJournal } from '../controllers/journalController.js';

const router = Router();

router.get(
  '/:studentId',
  auth, roles('parent','teacher','admin'),
  getJournal
);

export default router;