const Journal = require('../models/Journal');

// Add or update entry
exports.addEntry = async (req, res) => {
  const { date, learned, built, confused } = req.body;
  try {
    const entry = await Journal.findOneAndUpdate(
      { user: req.userId, date: new Date(date) }, // ensure Date type
      { learned, built, confused },
      { upsert: true, new: true }
    );
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save entry', error: err.message });
  }
};

// Get specific entry by date
exports.getEntry = async (req, res) => {
  try {
    const { date } = req.query; // expects ?date=YYYY-MM-DD
    const entry = await Journal.findOne({
      user: req.userId,
      date: new Date(date),
    });
    res.json(entry || {});
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch entry', error: err.message });
  }
};

// Get all entries (sorted by latest date first)
exports.getAllEntries = async (req, res) => {
  try {
    const entries = await Journal.find({ user: req.userId }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch logs', error: err.message });
  }
};
