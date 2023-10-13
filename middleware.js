const ExpressError = require('./utils/ExpressError.util'); // For customized errors
const { projectSchema, issueSchema } = require('./JoiSchemas');
const Project = require('./models/project.model');
const Issue = require('./models/issue.model');

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    // req.flash('error', 'You must be logged in!');
    return res.redirect('/users/login');
  }
  next();
};
const storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

// Middlewares for validation :
function validateProject(req, res, next) {
  const { error } = projectSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}
async function isAuthor(req, res, next) {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project.author.equals(req.user._id)) {
    // req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/oneCamp/${project._id}`);
  }
  next();
}
function validateIssue(req, res, next) {
  const { error } = issueSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}
async function isIssueAuthor(req, res, next) {
  const { id, issueId } = req.params;
  const issue = await Issue.findById(issueId);
  if (!issue.author.equals(req.user._id)) {
    // req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/oneCamp/${id}`);
  }
  next();
}

module.exports = {
  isLoggedIn,
  storeReturnTo,
  validateProject,
  isAuthor,
  validateIssue,
  isIssueAuthor,
};
