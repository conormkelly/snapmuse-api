const User = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');

// Controller methods
async function register(req, res, next) {
  const { username, password } = req.body;

  // Check for existing user
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return next(
      new ErrorResponse({
        statusCode: 400,
        message: 'Username already exists!',
      })
    );
  }

  const user = await User.create({ username, password });
  const token = user.getToken();
  return res.status(200).json({ success: true, token });
}

async function login(req, res, next) {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
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
  return res.status(200).json({ success: true, token });
}

async function logout(req, res, next) {
  return res.status(200).json({
    success: true,
    token: null
  });
}

// TODO: temporary For testing tokens
function test(req, res, next) {
  console.log(res.locals.user);
  return res.status(200).json({ success: true, message: 'YAY!' });
}

module.exports = {
  register,
  login,
  logout,
  test,
};
