import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { hash: _hash, compare } = bcrypt;//fix начал через require и теперь это заглушка
const { sign } = jwt;

export async function register(req, res, next) {
  try {
    let { name, email, password, role, childIds, groups } = req.body;
    const hash = await _hash(password, 10);

    if (role === 'parent' && childEmail) {
      const child = await User.findOne({ email: childEmail });
      if (child) {
        childIds = [child._id];
      }
    }

    if (groups && typeof groups === 'string') {
      groups = [groups];
    }
    
    const user = new User({ name, email, password: hash, role, childIds: childIds || [], groups: groups || [] });
    await user.save();
    res.json({ msg: 'Пользователь создан' });
  } catch(err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Неверные данные' });
    const match = await compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Неверные данные' });
    const token = sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );
    res.json({ token, role: user.role, name: user.name });
  } catch(err) {
    next(err)
  }
}