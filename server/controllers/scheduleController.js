import Schedule from '../models/Schedule.js';
export async function getSchedule(req, res, next) {
  try{
    const sched = await Schedule.find();
    res.json(sched);
  } catch (err) {
    next(err);
  }
}

export async function addSchedule(req, res, next) {
  try {
    const { dayOfWeek, subject, time, groupName } = req.body;

    const newLesson = new Schedule({
      dayOfWeek,
      subject,
      time,
      groupName
    });

    await newLesson.save();

    res.status(201).json({ 
      msg: 'Урок успешно добавлен в расписание', 
      lesson: newLesson 
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteSchedule(req, res, next) {
  try {
    const lesson = await Schedule.findByIdAndDelete(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({ msg: 'Урок не найден' });
    }

    res.json({ msg: 'Урок удален' });
  } catch (err) {
    next(err);
  }
}