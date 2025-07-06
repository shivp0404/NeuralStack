const Snippet = require('../models/Snippet');

exports.getStats = async (req, res) => {
  try {
    const userId = req.userId;

    const totalSnippets = await Snippet.countDocuments({ owner: userId });
    const totalRevisions = await Snippet.aggregate([
      { $match: { owner: userId } },
      { $unwind: '$revisionHistory' },
      { $count: 'count' }
    ]);

    const aiUsed = await Snippet.countDocuments({
      owner: userId,
      'aiInsights.explanation': { $ne: '' }
    });

    res.json({
      totalSnippets,
      totalRevisions: totalRevisions[0]?.count || 0,
      aiUsed
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get stats', error: err.message });
  }
};

exports.getHeatmapData = async (req, res) => {
  try {
    const userId = req.userId;

    const snippets = await Snippet.aggregate([
      { $match: { owner: req.userId } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(snippets);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get heatmap', error: err.message });
  }
};
