const Snippet = require('../models/Snippet');

// GET all snippets for user
exports.getSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find({ owner: req.userId });
    res.json(snippets);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET single snippet
exports.getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findOne({ _id: req.params.id, owner: req.userId });
    if (!snippet) return res.status(404).json({ message: 'Snippet not found' });
    res.json(snippet);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// CREATE a new snippet
exports.createSnippet = async (req, res) => {
  try {
    const newSnippet = new Snippet({ ...req.body, owner: req.userId });
    await newSnippet.save();
    res.status(201).json(newSnippet);
  } catch (err) {
    res.status(400).json({ message: 'Error saving snippet', error: err.message });
  }
};

// UPDATE a snippet
exports.updateSnippet = async (req, res) => {
  try {
    const updated = await Snippet.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Snippet not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error updating snippet', error: err.message });
  }
};

// DELETE a snippet
exports.deleteSnippet = async (req, res) => {
  try {
    const deleted = await Snippet.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!deleted) return res.status(404).json({ message: 'Snippet not found' });
    res.json({ message: 'Snippet deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting snippet', error: err.message });
  }
};
