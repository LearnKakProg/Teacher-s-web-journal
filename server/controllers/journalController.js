import User from '../models/User.js';
import Grade from '../models/Grade.js';
import Attendance from '../models/Attendance.js';
import mongoose from 'mongoose';

export async function getJournal(req, res, next) {
  try {
    const { studentId } = req.params;

    if (req.user.role === 'parent') {
      const parent = await User.findById(req.user.id);
      if (!parent.childIds.includes(studentId)) 
        return res.status(403).json({ msg: 'Доступ запрещён' });
    }

    const from = req.query.from ? new Date(req.query.from) : new Date('2026-01-01');
    const to   = req.query.to   ? new Date(req.query.to)   : new Date('2026-04-01');


    const subjects = await Grade.distinct('subject', { student: studentId });

    const gradeDates = await Grade.distinct('date', { student: studentId, date: { $gte: from, $lt: to } });
    const attDates   = await Attendance.distinct('date',{ student: studentId, date: { $gte: from, $lt: to } });
    const dates = Array.from(new Set([...gradeDates, ...attDates]))
                  .sort((a,b)=>a-b)
                  .map(d=>d.toISOString().slice(0,10));


    const grades = await Grade.find({ student: studentId, date: { $gte: from, $lt: to } });
    const atts   = await Attendance.find({ student: studentId, date: { $gte: from, $lt: to } });

    const records = {};
    subjects.forEach(s=> records[s] = {});
    grades.forEach(g => {
      const d = g.date.toISOString().slice(0,10);
      records[g.subject][d] = { grade: g.score };
    });
    atts.forEach(a => {
      const d = a.date.toISOString().slice(0,10);
      if (!records[a.subject]?.[d])
        records[a.subject][d] = { status: a.status };
    });

    res.json({ subjects, dates, records });
  } catch(err) {
    next(err);
  }
}