const express = require('express');
const router = express.Router();

const getFirstPage = require('../controllers/index.controller');

router.get('/', getFirstPage.getFirstPage);


module.exports = router;
