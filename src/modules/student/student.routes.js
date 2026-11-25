const express = require('express');
const studentController = require('./student.controller');

const router = express.Router();

router.get('/stats', studentController.getStudentStats);

router.get('/', studentController.getStudents);

router.get('/:id', studentController.getStudentById);

router.post('/', studentController.createStudent);

router.put('/:id', studentController.updateStudent);

router.delete('/:id', studentController.deleteStudent);

module.exports = router;
