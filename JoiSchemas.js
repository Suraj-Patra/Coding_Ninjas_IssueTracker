const BaseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!',
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHTML(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error('string.escapeHTML', { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

// Defining Schema for validating with Joi :
const projectSchema = Joi.object({
  title: Joi.string().required().escapeHTML(),
  author: Joi.string().required().escapeHTML(),
  description: Joi.string().required().escapeHTML(),
});
const issueSchema = Joi.object({
  title: Joi.string().required().escapeHTML(),
  description: Joi.string().required().escapeHTML(),
  labels: Joi.required(),
});

module.exports = {
  projectSchema,
  issueSchema,
};
