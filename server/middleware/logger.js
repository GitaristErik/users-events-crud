const morgan = require('morgan');

// Custom token for request body (only log small bodies)
morgan.token('body', (req) => {
  if (req.body && Object.keys(req.body).length > 0) {
    const body = { ...req.body };
    // Remove sensitive fields
    delete body.password;
    delete body.currentPassword;
    delete body.newPassword;

    const bodyStr = JSON.stringify(body);
    return bodyStr.length > 1000 ? '[Large Body]' : bodyStr;
  }
  return '';
});

// Custom format for development
const developmentFormat = ':method :url :status :res[content-length] - :response-time ms :body';

// Custom format for production
const productionFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

const requestLogger = process.env.NODE_ENV === 'production'
  ? morgan(productionFormat)
  : morgan(developmentFormat);

module.exports = requestLogger;
