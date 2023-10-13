const express = require('express');
const router = express.Router({ mergeParams: true }); // For using params from app.js

/* Local Imports */
const catchAsync = require('../utils/catchAsync.util'); // For catching asynchronous errors
const { validateIssue, isLoggedIn, isIssueAuthor } = require('../middleware');
const {
  handleAddIssue,
  handleDeleteIssue,
} = require('../controllers/issues.controller');

// Add review for Campground :
router.post('/', isLoggedIn, validateIssue, catchAsync(handleAddIssue));

// Delete review for Campground :
router.delete(
  '/:issueId',
  isLoggedIn,
  isIssueAuthor,
  catchAsync(handleDeleteIssue)
);

module.exports = router;
