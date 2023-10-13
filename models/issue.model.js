const mongoose = require('mongoose');
const { Schema } = mongoose;

const IssueSchema = new Schema({
  title: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  description: String,
  labels: [{ type: String }],
});

const Issue = mongoose.model('Issue', IssueSchema);
module.exports = Issue;
