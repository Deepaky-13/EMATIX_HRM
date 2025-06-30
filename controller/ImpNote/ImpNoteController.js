import Note from "../../model/ImpNotes/ImpNoteModel.js";

export const createImpNote = async (req, res) => {
  try {
    const saved = await Note.create(req.body);
    res.status(201).json(saved, "note is created");
  } catch (err) {
    res.status(400).json({ saved, error: err.message });
  }
};

export const getAllImpNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getImpNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).send("ImpNote not found");
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateImpNote = async (req, res) => {
  try {
    const updated = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).send("ImpNote not found");
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteImpNote = async (req, res) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("ImpNote not found");
    res.send("ImpNote deleted");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
