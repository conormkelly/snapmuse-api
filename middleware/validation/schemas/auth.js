module.exports = {
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
      pattern: '^[a-zA-Z0-9_-]+$',
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 200,
      strongPassword: true,
    },
  },
  required: ['username', 'password'],
  additionalProperties: false,
  errorMessage: {
    properties: {
      username: 'Username must be between 4 - 20 characters.',
      password:
        'Password must be 8 - 200 characters in length and contain at least 1 number and 1 uppercase letter.',
    },
    required: 'Username and Password are required.',
    _: 'Please provide a valid Username and Password only.',
  },
};
