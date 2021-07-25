// For local loading of env variables only,
// this avoids having dotenv as a runtime dependency

const dotenv = require('dotenv');

const loaded = dotenv.config();
if (loaded.error) {
    throw loaded.error;
}
