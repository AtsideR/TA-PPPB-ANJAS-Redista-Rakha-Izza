// api/server.js
// Vercel serverless function wrapper for the Express app
const serverless = require('serverless-http');
const app = require('../src/index');

const handler = serverless(app);

// export compatible signatures
module.exports = handler;
module.exports.handler = handler;
