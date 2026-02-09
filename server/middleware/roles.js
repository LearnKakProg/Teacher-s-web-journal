export default (...allowed) => (req, res, next) => {
    if (!allowed.includes(req.user.role))
      return res.status(403).json({ msg: 'Доступ запрещён' });
    next();
  };