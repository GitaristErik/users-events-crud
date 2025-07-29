var express = require('express');
var router = express.Router();

/* GET API status */
router.get('/', function(req, res, next) {
  res.json({ message: 'Users Events API Server', status: 'running' });
});

module.exports = router;
