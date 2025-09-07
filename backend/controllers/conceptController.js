const Snippet = require('../models/Snippet');

const knownConcepts = ['dp', 'graph', 'sql', 'jwt', 'recursion', 'array', 'auth', 'hooks'];

exports.getConceptStats = async (req, res) => {
  try {
    const snippets = await Snippet.find({ owner: req.userId });
    const conceptCount = {};

    knownConcepts.forEach(concept => conceptCount[concept] = 0);

    snippets.forEach(snippet => {
      snippet.tags.forEach(tag => {
        const t = tag.toLowerCase();
        if (knownConcepts.includes(t)) {
          conceptCount[t]++;
        }
      });
    });

    res.json(conceptCount);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch concept stats', error: err.message });
  }
};
