import { Schema, model } from 'mongoose';

 const TrimestreSchema = new Schema({
   name: { type: String, required: true, unique: true },
   start: { type: Date, required: true },
   end:   { type: Date, required: true }
 }, { timestamps: true });

 export default model('Trimestre', TrimestreSchema);