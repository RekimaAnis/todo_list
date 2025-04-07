const express = require('express');
const router = express.Router();

// import controller for books
const controller = require('../controllers/groupsrest.controller');

// use different method to provide REST operations
router.get('/', controller.allGroups);
router.get('/no-group', controller.getStudentWithoutGroup);
router.get('/:groupNUmber', controller.getStudentInGroup);
router.post('/assign', controller.assignStudentToGroup);
router.delete('/:id', controller.removeFromGroup);

module.exports = router;
