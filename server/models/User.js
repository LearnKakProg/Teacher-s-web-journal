import { Schema, model } from 'mongoose';
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin','teacher','student','parent'], required: true },
  groups: [{ type: String }],//не только класс но это на будущее
  childIds: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});
export default model('User', userSchema);