const app = require('./app');

const sequelize = require('./config/db');
const userService = require('./services/auth');

// Wait for DB to connect before starting API

sequelize
  .sync()
  .then(() => {
    userService.findUserByUsername('admin').then((user) => {
      if (!user) {
        console.log('No admin user found...');

        userService
          .createUser({
            username: 'admin',
            password: process.env.ADMIN_USER_PASSWORD,
            isAdmin: true,
          })
          .then(() => {
            console.log('Created admin user!');
          });
      } else {
        console.log('Existing admin user was found.');
      }
    });
  })
  .then(() => {
    app.listen(3000, () => {
      console.log('Listening on port 3000');
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
