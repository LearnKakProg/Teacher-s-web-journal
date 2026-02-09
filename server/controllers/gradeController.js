import Grades from '../models/Grades.js';
import Grade from '../models/Grades.js';
import User from '../models/User.js';
import { Types } from 'mongoose';

export async function addGrade(req, res, next) {
  try {
    if (!await User.exists({ _id: req.body.student, role: 'student' })) {
      return res.status(404).json({ msg: 'Ученик не найден' });
    }
    const grade = new Grade({
      student: new Types.ObjectId(req.body.student),
      subject: req.body.subject,
      score: req.body.score,
      groupName: req.body.groupName
    });
    await grade.save();
    res.status(201).json({ msg: 'Оценка добавлена', grade });
  } catch (err) {
    next(err);
  }
}

export async function editGrade(req, res, next) {
  try {
    const update = {};
    if (req.body.score !== undefined) update.score = req.body.score;
    if (req.body.subject) update.subject = req.body.subject;

    const grade = await Grades.findOneAndUpdate(
      { _id: req.params.id },
      update,
      { new: true, runValidators: true }
    );
    if (!grade) return res.status(404).json({ msg: 'Оценка не найдена' });
    res.json(grade);
  } catch (err) {
    next(err);
  }
}

export async function getGrades(req, res, next) {
  try {
    const filter = {};
    const role = req.user.role;
    if (role === 'parent') {
      const parent = await User.findById(req.user.id);
      filter.student = { $in: parent.childIds.map(id => new Types.ObjectId(id)) };
    } 
    if ((role === 'teacher' || role === 'admin') && req.query.student) {
      filter.student = new Types.ObjectId(req.query.student);
    }
    const grades = await Grade.find(filter).populate('student','name className');
    res.json(grades);
  } catch (err) {
    next(err);
  }
}

export async function deleteGrade(req, res, next) {
  try {
    const grade = await Grades.findByIdAndDelete(req.params.id);
    if (!grade) return res.status(404).json({ msg: 'Оценка не найдена' });
    res.json({ msg: 'Оценка удалена' });
  } catch (err) {
    next(err);
  }
}