const mongoose = require('mongoose');

const SnippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'javascript'
  },
  tags: [{
    type: String
  }],
  category: {
    type: String,
    default: 'General'
  },
  source: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  revisionSchedule: {
    day3: Date,
    day7: Date,
    day30: Date
  },
  revisionHistory: [{
    date: Date,
    status: {
      type: String,
      enum: ['reviewed', 'skipped', 'snoozed']
    }
  }],
  aiInsights: {
    explanation: {
      type: String,
      default: ''
    },
    generatedTags: [{
      type: String
    }]
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

module.exports = mongoose.model('Snippet', SnippetSchema);
