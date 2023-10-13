/* Local Imports */
const Project = require('../models/project.model');
const Issue = require('../models/issue.model');

const handleAddIssue = async (req, res) => {
  const project = await Project.findById(req.params.id);
  const issue = await Issue.create({
    ...req.body,
    author: req.user._id,
  });
  project.issues.push(issue);
  await project.save();
  //   req.flash('success', 'Created new review!');
  res.redirect(`/oneProject/${project._id}`);
};
const handleDeleteIssue = async (req, res) => {
  const { id, issueId } = req.params;
  // remove an element from an array in mongo
  await Project.findByIdAndUpdate(id, {
    $pull: { issues: issueId },
  });
  await Issue.findByIdAndDelete(issueId);
  //   req.flash('success', 'Successfully deleted review!');
  res.redirect(`/oneProject/${id}`);
};

module.exports = {
  handleAddIssue,
  handleDeleteIssue,
};
