const express = require('express');
const router = express.Router();
const { getQuizzes, getQuiz, createQuiz, updateQuiz, deleteQuiz } = require('../controllers/quizController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, getQuizzes);
router.get('/:id', auth, getQuiz);
router.post('/', auth, admin, createQuiz);
router.put('/:id', auth, admin, updateQuiz);
router.delete('/:id', auth, admin, deleteQuiz);

module.exports = router;
