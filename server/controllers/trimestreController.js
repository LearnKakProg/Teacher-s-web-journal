import Trimestre from '../models/Trimestre.js';

export async function listTrimesters(req, res, next) {
  try {
    const list = await Trimestre.find({}).sort({ start: 1 });
    res.json(list);
  } catch (err) {
    next(err);
  }
}

export async function addTrimestre(req, res, next) {
  try {
    const { name, start, end } = req.body;
    const newTr = await Trimestre.create({ name, start, end });
    res.status(201).json(newTr);
  } catch (err) {
    next(err);
  }
}

export async function editTrimestre(req, res, next) {
  try {
    const { id } = req.params;
    const { name, start, end } = req.body;
    const updated = await Trimestre.findByIdAndUpdate(
      id,
      { name, start, end },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Триместр не найден' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteTrimestre(req, res, next) {
  try {
    const { id } = req.params;
    const removed = await Trimestre.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ msg: 'Триместр не найден' });
    res.json({ msg: 'Триместр удалён' });
  } catch (err) {
    next(err);
  }
}