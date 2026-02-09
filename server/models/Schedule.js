import { Schema, model } from 'mongoose';
const scheduleSchema = new Schema({
  dayOfWeek: { type: String, enum: ['Понедельник','Вторник','Среда','Четверг', 'Пятница', 'Суббота', 'Воскресенье']},
  subject: { type: String, required: true, trim: true, minlength: 2 },
  time: String,
  groupName: { type: String, required: true } //не только классы, тут еще кружки могут быть
});
export default model('Schedule', scheduleSchema);