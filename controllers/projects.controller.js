/* Local Imports */
const Project = require('../models/project.model');

// Get Project :
const handleGetAllProjects = async (req, res) => {
  const projects = await Project.find({}).populate('author');
  res.render('projects/allProjects', { projects });
};
const handleGetOneProject = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate({ path: 'issues', populate: { path: 'author' } })
    .populate('author');
  // If project not found
  if (!project) {
    // req.flash('error', 'Project not found!');
    return res.redirect('/');
  }
  res.render('projects/oneProject', { project });
};

// Add Project :
const handleRenderAddProject = (req, res) => {
  res.render('projects/newProject');
};
const handleAddProject = async (req, res, next) => {
  const project = await Project.create({
    ...req.body,
    author: req.user._id,
  });
  // req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/oneProject/${project._id}`);
};

// Delete Project :
const handleDeleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  //   req.flash('success', 'Successfully deleted campground!');
  res.redirect('/');
};

module.exports = {
  handleGetAllProjects,
  handleGetOneProject,
  handleRenderAddProject,
  handleAddProject,
  handleDeleteProject,
};
