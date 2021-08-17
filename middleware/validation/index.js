const ErrorResponse = require('../../utils/ErrorResponse');

// Import schemas
const authSchema = require('./schemas/auth');

// Import and instantiate Ajv
const Ajv = require('ajv').default;
const ajv = new Ajv({ allErrors: true });

// Add ajv-errors
const ajvErrors = require('ajv-errors');
ajvErrors(ajv);

// Define custom keywords
ajv.addKeyword({
  keyword: 'strongPassword',
  type: 'string',
  validate: function (kwVal, data, metadata, dataCxt) {
    const hasNumber = /\d/.test(data);
    const hasUpper = /[A-Z]/.test(data);
    const hasLower = /[a-z]/.test(data);
    return hasNumber && hasUpper && hasLower;
  },
});

// Compile the schemas into validators
const authValidator = ajv.compile(authSchema);

/**
 * Generates a middleware function for the schema.
 * @param {Function} validator
 * @returns {(req, res, next) => void}
 */
const createMiddlewareValidator = (validator) => {
  return (req, res, next) => {
    const isValid = validator(req.body);
    if (isValid) {
      return next();
    } else {
      return next(
        new ErrorResponse({
          statusCode: 400,
          message: validator.errors[0].message,
        })
      );
    }
  };
};

module.exports = {
  auth: createMiddlewareValidator(authValidator),
};
