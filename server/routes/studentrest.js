const express = require('express');
const router = express.Router();

// import controller for books
const controller = require('../controllers/studentrest.controller');

// use different method to provide REST operations
router.get('/', controller.allStudent);
router.post('/', controller.addStudent);
router.put('/:id', controller.updateStudent)
router.delete('/:id', controller.deleteStudent);

module.exports = router;
