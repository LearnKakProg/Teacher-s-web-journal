import { Router } from 'express';
import auth from '../middleware/auth.js';
import roles from '../middleware/roles.js';
import { listStudents, listTeachers, getUserById, searchUsers, deleteUserById, updateUser } from '../controllers/userController.js';

const router = Router();

router.get('/students', auth, roles('admin','teacher','parent'), listStudents);
router.get('/search', auth, searchUsers);
router.get('/:id', auth, getUserById);
router.delete('/:id', auth, roles('admin'), deleteUserById);
router.put('/:id', auth, roles('admin'), async (req, res, next) => {
    try {
            await updateUser(req, res, next);
          } catch (e) {
            next(e);
          }});
export default router;