const express = require('express');
const router = express.Router();

const getFirstPage = require('../controllers/student.controller');

router.get('/', getFirstPage.getFirstPage);


module.exports = router;
