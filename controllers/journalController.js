const Journal = require('../models/Journal');

exports.addEntry = async (req, res) => {
  const { date, learned, built, confused } = req.body;
  try {
    const entry = await Journal.findOneAndUpdate(
      { user: req.userId, date },
      { learned, built, confused },
      { upsert: true, new: true }
    );
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save entry', error: err.message });
  }
};

exports.getEntry = async (req, res) => {
  try {
    const entry = await Journal.findOne({ user: req.userId, date: req.query.date });
    res.json(entry || {});
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch entry', error: err.message });
  }
};

exports.getAllEntries = async (req, res) => {
  try {
    const entries = await Journal.find({ user: req.userId }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch logs', error: err.message });
  }
};
