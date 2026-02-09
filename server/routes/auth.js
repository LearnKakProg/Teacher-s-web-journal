import { body } from 'express-validator';
import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import roles from '../middleware/roles.js';
import validate from '../utils/validator.js';

const router = Router();

router.post(
    '/login',
    validate([
        body('email').isEmail().isLength({ min: 4 }).withMessage('Неверный формат электронной почты'),
        body('password').notEmpty().isLength({ min: 6 }).withMessage('Пароль не может быть пустым или меньше 6 символов'),
    ]),
    login);

router.post(
    '/register',
    auth, 
    roles('admin'),
    validate([
       body('email').isEmail().withMessage('Неверный формат электронной почты'),
       body('name').notEmpty().isLength({ min: 1 }).withMessage('Имя не может быть пустым или меньше 4 символов'),
       body('role').isIn(['admin','teacher','student','parent']).withMessage('Неверная роль пользователя'),
       body('password').notEmpty().isLength({ min: 6 }).withMessage('Пароль не может быть пустым или меньше 6 символов'),
    ]),
    register);

export default router;