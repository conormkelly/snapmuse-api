const { Sequelize } = require('sequelize');

// Use an in-memory database connection during tests
const connectionString =
  process.env.NODE_ENV === 'test'
    ? 'sqlite::memory:'
    : process.env.DB_CONNECTION_STRING;

const sequelize = new Sequelize(connectionString, {
  logging: process.env.NODE_ENV === 'development',
});

module.exports = sequelize;
