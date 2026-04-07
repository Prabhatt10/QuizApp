const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length >= 2 && v.length <= 6;
      },
      message: 'A question must have between 2 and 6 options'
    },
    required: true
  },
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: 0
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  category: {
    type: String,
    trim: true,
    default: 'General'
  },
  timeLimit: {
    type: Number,
    required: true,
    default: 300, // seconds (5 minutes)
    min: 30
  },
  questions: {
    type: [questionSchema],
    validate: {
      validator: function (v) {
        return v.length >= 1;
      },
      message: 'A quiz must have at least 1 question'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
