const Snippet = require('../models/Snippet');

// GET /api/revision/history
exports.getRevisionHistory = async (req, res) => {
  try {
    const snippets = await Snippet.find({ owner: req.userId })
      .select("title revisionHistory")
      .lean();
  // console.log(snippets)

    // Flatten revisionHistory into { date, count } format
    const historyMap = {};

    snippets.forEach(snippet => {
      snippet.revisionHistory.forEach(entry => {
        const day = entry.date.toISOString().split("T")[0]; // YYYY-MM-DD
        if (!historyMap[day]) historyMap[day] = 0;
        historyMap[day] += 1;
      });
    });

    // Convert into array for frontend
    const history = Object.keys(historyMap).map(date => ({
      date,
      count: historyMap[date],
    }));

    res.json(history);
  } catch (err) {
    console.error("Error fetching revision history:", err);
    res.status(500).json({ message: "Failed to fetch revision history" });
  }
};



// GET revision queue
exports.getRevisionQueue = async (req, res) => {
  try {
    const today = new Date();

    const snippets = await Snippet.find({
      owner: req.userId,
      $or: [
        { "revisionSchedule.day3": { $lte: today } },
        { "revisionSchedule.day7": { $lte: today } },
        { "revisionSchedule.day30": { $lte: today } },
      ],
    }).select("title code language revisionSchedule revisionHistory");

    res.json(snippets);
  } catch (err) {
    console.error("Error fetching revision queue:", err);
    res.status(500).json({ message: "Failed to fetch revision queue", error: err.message });
  }
};


// POST schedule revision
exports.scheduleRevision = async (req, res) => {
  const { snippetId } = req.body;
  const now = new Date();

  try {
    const snippet = await Snippet.findOne({ _id: snippetId, owner: req.userId });
    if (!snippet) return res.status(404).json({ message: 'Snippet not found' });

    snippet.revisionSchedule = {
      day3: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      day7: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      day30: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    };

    await snippet.save();
    res.json({ message: 'Revision scheduled', revisionSchedule: snippet.revisionSchedule });
  } catch (err) {
    res.status(500).json({ message: 'Failed to schedule', error: err.message });
  }
};


// PUT mark as reviewed
exports.markReviewed = async (req, res) => {
  const { snippetId } = req.body;

  try {
    const snippet = await Snippet.findOne({ _id: snippetId, owner: req.userId });
    if (!snippet) return res.status(404).json({ message: "Snippet not found" });

    // Add revision history entry
    snippet.revisionHistory.push({ date: new Date(), status: "reviewed" });

    // Clear schedule so it won’t come back in queue
    snippet.revisionSchedule = {};

    await snippet.save();

    res.json({ message: "Marked as reviewed" });
  } catch (err) {
    console.error("Error marking reviewed:", err);
    res.status(500).json({ message: "Failed to mark reviewed", error: err.message });
  }
};




// PUT snooze revision
exports.snoozeRevision = async (req, res) => {
  const { days } = req.body; // number of days to snooze
  const { id } = req.params; // snippet id

  try {
    const snippet = await Snippet.findOne({ _id: id, owner: req.userId });
    if (!snippet) return res.status(404).json({ message: "Snippet not found" });

    const ms = days * 24 * 60 * 60 * 1000;

    // Move all scheduled dates forward
    Object.keys(snippet.revisionSchedule).forEach(key => {
      if (snippet.revisionSchedule[key]) {
        snippet.revisionSchedule[key] = new Date(
          new Date(snippet.revisionSchedule[key]).getTime() + ms
        );
      }
    });

    // Add history entry
    snippet.revisionHistory.push({ date: new Date(), status: "snoozed" });

    await snippet.save();

    res.json({ message: `Snoozed by ${days} day(s)` });
  } catch (err) {
    console.error("Error snoozing revision:", err);
    res.status(500).json({ message: "Failed to snooze", error: err.message });
  }
};


