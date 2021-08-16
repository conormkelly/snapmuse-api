const asyncHandler = require('../utils/asyncHander');
const ErrorResponse = require('../utils/ErrorResponse');

const authService = require('../services/auth');

exports.register = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  const existingUser = await authService.findUserByUsername(username);

  if (existingUser) {
    return next(
      new ErrorResponse({
        statusCode: 400,
        message: 'Username already exists. Please try again.',
      })
    );
  }

  const user = await authService.createUser({ username, password });
  const token = user.getToken();
  return res.status(200).json({ success: true, data: token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await authService.findUserByUsername(username);

  if (!user) {
    return next(
      new ErrorResponse({
        statusCode: 401,
        message: 'Invalid username or password.',
      })
    );
  }

  const isCorrectPassword = await user.isCorrectPassword(password);
  if (!isCorrectPassword) {
    return next(
      new ErrorResponse({
        statusCode: 401,
        message: 'Invalid username or password.',
      })
    );
  }

  const token = user.getToken();
  return res.status(200).json({ success: true, data: token });
});

exports.logout = (req, res, next) => {
  return res.status(200).json({
    success: true,
    data: null,
  });
};
