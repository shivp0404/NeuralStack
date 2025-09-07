const { openaiRequest } = require('../services/openaiService');
const crypto = require("crypto");
const {redisClient} = require('../utils/redisClient')
// POST /api/ai/explain
exports.explainCode = async (req, res) => {
 const { code } = req.body;

  if (!code) return res.status(400).json({ message: 'Code is required' });

  try {
    // 1️⃣ Create a unique hash for the code snippet
    const hashKey = crypto.createHash("md5").update(code).digest("hex");
    const cacheKey = `explain:${hashKey}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("➡️ Explanation from Redis cache");
      return res.json({ explanation: cached, cached: true });
    }

    const explanation = await openaiRequest(code);

    await redisClient.setEx(cacheKey, 86400, explanation);
    
    res.json({ explanation });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate explanation' });
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
