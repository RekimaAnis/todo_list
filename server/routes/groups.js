const express = require('express');
const router = express.Router();

const { getFirstPage} = require('../controllers/groups.controller');

router.get('/', getFirstPage);


module.exports = router;
