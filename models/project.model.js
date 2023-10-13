const mongoose = require('mongoose');
// const { campgroundSchema } = require('../JoiSchemas');
const Schema = mongoose.Schema;

const Issue = require('./issue.model');

const ProjectSchema = new Schema({
  title: String,
  description: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  issues: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Issue',
    },
  ],
});

// After deleting campground, all reviews associated with it will be removed.
// "findOneAndDelete" will be only trigerred, if the campground is deleted by "findByIdAndDelete"
ProjectSchema.post('findOneAndDelete', async function (project) {
  if (project) {
    await Issue.deleteMany({ _id: { $in: project.issues } });
  }
});

const Project = new mongoose.model('Project', ProjectSchema);

module.exports = Project;
