import User from '../models/User.js';
export async function listStudents(req, res, next) {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (err) {
    next(err)
  }
}

export async function searchUsers(req, res, next) {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    const users = await User.find({
      name: { $regex: q, $options: 'i' }
    })
    .select('name _id role groups')
    .limit(10);

    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function deleteUserById(req, res, next) {
  try {
    const { id } = req.params;
    const removed = await User.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ msg: 'Пользователь не найден' });
    res.json({ msg: 'Пользователь удалён' });
  } catch (err) {
    next(err);
  }
};

export async function getUserById(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, role, groups, childIds, password } = req.body;
    const update = {};
    if (name)   update.name   = name;
    if (email)  update.email  = email;
    if (role)   update.role   = role;
    if (groups) update.groups = Array.isArray(groups) ? groups : [groups];
    if (childIds) update.childIds = childIds;
    if (password) {
      const { hash } = await import('bcryptjs');
      update.password = await hash(password, 10);
    }

    const updated = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
      select: '-password'
    });
    if (!updated) return res.status(404).json({ msg: 'Пользователь не найден' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}