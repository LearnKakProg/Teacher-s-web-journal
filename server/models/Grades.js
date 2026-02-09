import { Schema, model } from 'mongoose';
const gradeSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true, trim: true, minlength: 2 },
  score: Schema.Types.Mixed, //для оценок и для отметок
  groupName: { type: String, required: true },
  date: { type: Date, default: Date.now }
});
export default model('Grade', gradeSchema);