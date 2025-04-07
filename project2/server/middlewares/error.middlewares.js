var express = require('express');
var router = express.Router();

var errorController = require('../controllers/error.controller');

// catch 404 and forward to error handler
router.use(errorController.notFound);
// error handler
router.use(errorController.handleError);

module.exports = router;
