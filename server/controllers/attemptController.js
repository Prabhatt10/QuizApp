const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');

// POST /api/attempts — submit a quiz attempt
exports.submitAttempt = async (req, res, next) => {
  try {
    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // Calculate score
    let score = 0;
    const processedAnswers = quiz.questions.map((question, index) => {
      const userAnswer = answers[index];
      const selectedOption = userAnswer !== undefined ? userAnswer : -1;
      const isCorrect = selectedOption === question.correctAnswer;
      if (isCorrect) score++;
      return {
        questionIndex: index,
        selectedOption,
        isCorrect
      };
    });

    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    const attempt = await Attempt.create({
      user: req.user._id,
      quiz: quizId,
      score,
      totalQuestions,
      percentage,
      answers: processedAnswers
    });

    // Return results with correct answers for review
    const results = quiz.questions.map((q, i) => ({
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      selectedOption: processedAnswers[i].selectedOption,
      isCorrect: processedAnswers[i].isCorrect
    }));

    res.status(201).json({
      attemptId: attempt._id,
      score,
      totalQuestions,
      percentage,
      results
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/attempts/my — get user's attempt history
exports.getMyAttempts = async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ user: req.user._id })
      .populate('quiz', 'title category')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(attempts);
  } catch (error) {
    next(error);
  }
};
