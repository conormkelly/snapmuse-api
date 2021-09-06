const asyncHandler = require('../utils/asyncHander');
const ErrorResponse = require('../utils/ErrorResponse');

const authService = require('../services/auth');

const ERROR_RESPONSE = {
  ALREADY_EXISTS: new ErrorResponse({
    statusCode: 400,
    message: 'Username already exists. Please try again.',
  }),
  INCORRECT_CREDENTIALS: new ErrorResponse({
    statusCode: 401,
    message: 'Incorrect username or password.',
  }),
  NOT_FOUND: new ErrorResponse({
    statusCode: 404,
    message: 'User not found.',
  }),
};

exports.register = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  const existingUser = await authService.findUserByUsername(username);

  if (existingUser) {
    return next(ERROR_RESPONSE.ALREADY_EXISTS);
  }

  const user = await authService.createUser({
    username,
    password,
    isAdmin: false,
  });
  const token = user.getToken();
  return res.status(201).json({ success: true, data: token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await authService.findUserByUsername(username);

  if (!user) {
    return next(ERROR_RESPONSE.INCORRECT_CREDENTIALS);
  }

  const isCorrectPassword = await user.isCorrectPassword(password);
  if (!isCorrectPassword) {
    return next(ERROR_RESPONSE.INCORRECT_CREDENTIALS);
  }

  const token = user.getToken();
  return res.status(200).json({ success: true, data: token });
});
