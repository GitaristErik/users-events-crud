const express = require('express');
const router = express.Router();

/* GET API status */
router.get('/', (req, res, next) => {
  res.json({ message: 'Users Events API Server', status: 'running' });
});

module.exports = router;
