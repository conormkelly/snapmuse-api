const app = require('./app');

const sequelize = require('./config/db');

// Wait for DB to connect before starting API

sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log('Listening on port 3000');
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
