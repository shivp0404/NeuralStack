const { openaiRequest } = require('../services/openaiService');

// POST /api/ai/explain
exports.explainCode = async (req, res) => {
  const { code } = req.body;

  if (!code) return res.status(400).json({ message: 'Code is required' });

  const prompt = `Explain the following code simply for a beginner:\n\n${code}`;

  try {
    const explanation = await openaiRequest(prompt);
    res.json({ explanation });
  } catch (err) {
    res.status(500).json({ message: 'AI error', error: err.message });
  }
};

// POST /api/ai/auto-tag
exports.autoTag = async (req, res) => {
  const { code } = req.body;

  if (!code) return res.status(400).json({ message: 'Code is required' });

  const prompt = `Suggest 5 relevant technical tags for this code snippet. Only return tags as a comma-separated list:\n\n${code}`;

  try {
    const tagResponse = await openaiRequest(prompt);
    const tags = tagResponse.split(',').map(tag => tag.trim().toLowerCase());
    res.json({ tags });
  } catch (err) {
    res.status(500).json({ message: 'AI error', error: err.message });
  }
};
