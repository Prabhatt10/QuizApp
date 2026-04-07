const Attempt = require('../models/Attempt');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

// GET /api/dashboard/leaderboard
exports.getLeaderboard = async (req, res, next) => {
  try {
    // Aggregate best score per user across all quizzes
    const leaderboard = await Attempt.aggregate([
      {
        $group: {
          _id: '$user',
          totalAttempts: { $sum: 1 },
          avgPercentage: { $avg: '$percentage' },
          bestPercentage: { $max: '$percentage' },
          totalScore: { $sum: '$score' }
        }
      },
      { $sort: { avgPercentage: -1, totalScore: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$user._id',
          name: '$user.name',
          totalAttempts: 1,
          avgPercentage: { $round: ['$avgPercentage', 1] },
          bestPercentage: 1,
          totalScore: 1
        }
      }
    ]);

    res.json(leaderboard);
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/admin-stats (admin only)
exports.getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalQuizzes, totalAttempts, recentAttempts] = await Promise.all([
      User.countDocuments(),
      Quiz.countDocuments(),
      Attempt.countDocuments(),
      Attempt.find()
        .populate('user', 'name')
        .populate('quiz', 'title')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    // Category breakdown
    const categoryStats = await Quiz.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalUsers,
      totalQuizzes,
      totalAttempts,
      categoryStats,
      recentAttempts
    });
  } catch (error) {
    next(error);
  }
};
