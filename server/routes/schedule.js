import { Router } from 'express';
import auth from '../middleware/auth.js';
import roles from '../middleware/roles.js';
import { body, param } from 'express-validator';
import { addSchedule, deleteSchedule, getSchedule } from '../controllers/scheduleController.js';
import validate from '../utils/validator.js';

const router = Router();
const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

router.post(
    '/',
    auth, roles('admin', 'teacher'),
    validate([
      body('dayOfWeek').isIn(DAYS).withMessage('Некорректный день недели'),
      body('subject').trim().notEmpty().withMessage('Укажите предмет'),
      body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Неверный формат времени (например, 14:30)'),
      body('groupName').notEmpty().withMessage('Группа не может быть пуста')
    ]),
    addSchedule
  );

  router.put(
    '/:id',
    auth, roles('admin', 'teacher'),
    validate([
      body('dayOfWeek').optional().isIn(DAYS),
      body('subject').optional().trim().notEmpty(),
      body('time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    ]),
  );

  router.delete(
    '/:id',
    auth,
    roles('admin', 'teacher'),
    validate([
      param('id').isMongoId().withMessage('Некорректный ID урока')
    ]),
    deleteSchedule
  );

router.get('/', auth, getSchedule);

export default router;