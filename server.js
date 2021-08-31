const app = require('./app');

const sequelize = require('./config/db');
const userService = require('./services/auth');

/**
 * Performs setup actions before the API starts listening:
 * - Connects to database and adds models.
 * - Adds the admin app user if not present.
 */
async function setup() {
  await sequelize.sync();
  console.log('Connected to database.');
  const adminUser = await userService.findUserByUsername('admin');
  if (!adminUser) {
    await userService.createUser({
      username: 'admin',
      password: process.env.ADMIN_USER_APP_PASSWORD,
      isAdmin: true,
    });
    console.log('Created admin user!');
  }
}

/**
 * Wait for setup tasks to complete and begin listening.
 */
async function main() {
  try {
    await setup();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}.`);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

main();
