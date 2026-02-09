import { body, param, query } from 'express-validator';
import { Router } from 'express';
import auth from '../middleware/auth.js';
import roles from '../middleware/roles.js';
import { addGrade, deleteGrade, editGrade, getGrades } from '../controllers/gradeController.js';
import validate from '../utils/validator.js';

const router = Router();
  router.post(
    '/',
    auth, roles('teacher'),
    validate([
      body('student')
        .isMongoId()
        .withMessage('Неверный ID ученика'),
      body('subject')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Предмет обязателен'),
      body('score')
        .custom(value => {
          if (Number.isInteger(value) && value >= 1 && value <= 5) {
        return true;
        }
        const s = String(value).trim().toUpperCase();
        if (s === 'Н' || s === 'Б') {
          return true;
        }})
        .withMessage('Оценка должна быть от 1 до 5, «Н» (отсутствие) или «Б» (болезнь)'),
      body('date')
        .exists({ checkFalsy: true })
        .withMessage('Поле «date» обязательно')
        .bail()
        .isISO8601()
        .toDate()
        .withMessage('Неверный формат даты (ожидается YYYY‑MM‑DD)'),
    ]),
    addGrade
  );
  
  router.put(
    '/:id',
    auth, roles('teacher'),
    validate([
      param('id').isMongoId(),
      body('score').optional().isInt({ min: 1, max: 5 }),
      body('score').optional().custom(value => {if (Number.isInteger(value) && value >= 1 && value <= 5) 
        return true;}).withMessage('Оценка должна быть от 1 до 5, «Н» (отсутствие) или «Б» (болезнь)'),
      ]),
    editGrade
      );
  
  router.get(
    '/',
    auth, roles('admin','teacher','parent'),
    validate([
      query('student').optional().isMongoId()
    ]),
    getGrades
  );
  
  router.delete(
    '/:id',
    auth,
    roles('teacher', 'admin'),
    validate([param('id').isMongoId()
    ]),
    deleteGrade
  );

  export default router;