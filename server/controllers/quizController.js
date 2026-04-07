const Quiz = require('../models/Quiz');

// GET /api/quizzes — list all quizzes (paginated)
exports.getQuizzes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;

    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }

    const [quizzes, total] = await Promise.all([
      Quiz.find(filter)
        .select('title description category timeLimit createdAt questions')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Quiz.countDocuments(filter)
    ]);

    // Add questionCount and remove full questions array from list
    const quizzesWithCount = quizzes.map(q => {
      const obj = q.toObject();
      obj.questionCount = obj.questions ? obj.questions.length : 0;
      delete obj.questions;
      return obj;
    });

    res.json({
      quizzes: quizzesWithCount,
      page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/quizzes/:id — get single quiz with questions
exports.getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // For regular users playing, hide correct answers
    const quizObj = quiz.toObject();
    if (req.user.role !== 'admin') {
      quizObj.questions = quizObj.questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options
        // correctAnswer omitted
      }));
    }

    res.json(quizObj);
  } catch (error) {
    next(error);
  }
};

// POST /api/quizzes — create quiz (admin)
exports.createQuiz = async (req, res, next) => {
  try {
    const { title, description, category, timeLimit, questions } = req.body;
    const quiz = await Quiz.create({
      title,
      description,
      category,
      timeLimit,
      questions,
      createdBy: req.user._id
    });
    res.status(201).json(quiz);
  } catch (error) {
    next(error);
  }
};

// PUT /api/quizzes/:id — update quiz (admin)
exports.updateQuiz = async (req, res, next) => {
  try {
    const { title, description, category, timeLimit, questions } = req.body;
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { title, description, category, timeLimit, questions },
      { new: true, runValidators: true }
    );
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }
    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/quizzes/:id — delete quiz (admin)
exports.deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }
    res.json({ message: 'Quiz deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
