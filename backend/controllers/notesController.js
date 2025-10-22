const DemoSchema = require('../models/rajschema');


exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new DemoSchema({ user: req.user.userId, title, content });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
};


exports.getNotes = async (req, res) => {
  try {
    const notes = await DemoSchema.find({ user: req.user.userId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};


exports.getNoteById = async (req, res) => {
  try {
    const note = await DemoSchema.findOne({ _id: req.params.id, user: req.user.userId });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch note' });
  }
};


exports.updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await DemoSchema.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { title, content, updatedAt: Date.now() },
      { new: true }
    );
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
};


exports.deleteNote = async (req, res) => {
  try {
    const note = await DemoSchema.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};
