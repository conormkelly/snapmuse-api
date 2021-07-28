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
  return sendToken(token, 201, res);
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
  return sendToken(token, 200, res);
}

async function logout(req, res, next) {
  res.cookie(process.env.JWT_COOKIE_NAME, 'none', {
    expires: Date.now(),
    httpOnly: true,
  });

  return res.status(200).json({
    success: true,
  });
}

// Helper function
const sendToken = (token, statusCode, res) => {
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  return res
    .status(statusCode)
    .cookie(process.env.JWT_COOKIE_NAME, token, options)
    .json({
      success: true,
      token,
    });
};

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
