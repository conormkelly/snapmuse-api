const registration = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'https://www.conormkelly.ie/schemas/auth.register.js',
  title: 'User Registration',
  description: 'Validates /auth/register request body',
  type: 'object',
  properties: {
    username: {
      type: 'string',
      minLength: 4,
      maxLength: 20,
      pattern: '^[a-zA-Z0-9]+$',
    },
    password: {
      type: 'string',
      minLength: 8,
      strongPassword: true,
    },
  },
  required: ['username', 'password'],
  additionalProperties: false,
  errorMessage: {
    properties: {
      username: 'Username must be between 4 - 20 characters.',
      password:
        'Password must be at least 8 characters long and contain at least 1 number, 1 lowercase letter and 1 uppercase letter.',
    },
    required: 'Username and Password are required.',
    _: 'Please provide a valid Username and Password only.',
  },
};

const login = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'https://www.conormkelly.ie/schemas/auth.login.js',
  title: 'User Login',
  description: 'Validates /auth/login request body',
  type: 'object',
  properties: {
    username: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  },
  required: ['username', 'password'],
  additionalProperties: false,
  errorMessage: {
    required: 'Username and Password are required.',
    _: 'Please provide a valid Username and Password only.',
  },
};

module.exports = { registration, login };
