import jwt from 'jsonwebtoken';

const{ verify } = jwt

export default (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Нет токена' });
  try {
    const decoded = verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: 'Неверный токен' });
  }
};