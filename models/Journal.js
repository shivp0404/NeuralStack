const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // "YYYY-MM-DD"
    required: true
  },
  learned: String,
  built: String,
  confused: String
});

module.exports = mongoose.model('Journal', JournalSchema);
