
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const CheckIn = require('../models/CheckIn');
const Journal = require('../models/Journal');
const User = require('../models/User');
const Token = require('../models/Token');
const { getSuggestions } = require('../services/geminiService');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

// @route   GET api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    // Get user data for streak info
    const user = await User.findById(req.user.id);
    
    // Get total check-ins count
    const totalCheckIns = await CheckIn.countDocuments({ user: req.user.id });
    
    // Get most recent check-in
    const lastCheckIn = await CheckIn.findOne({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    // Get completed journals count
    const completedJournals = await Journal.countDocuments({ user: req.user.id });
    
    // Get token balance
    const tokenBalance = user.tokens ? user.tokens.balance : 0;
    
    // Prepare response object
    const stats = {
      streakCount: user.streak.count,
      totalCheckIns,
      lastCheckIn: lastCheckIn ? lastCheckIn.createdAt : null,
      currentMood: lastCheckIn ? lastCheckIn.mood : null,
      completedJournals,
      tokenBalance
    };
    
    ApiResponse.success(res, stats, 'Dashboard stats retrieved');
  } catch (err) {
    logger.error('Error fetching dashboard stats', { error: err.message, userId: req.user.id });
    ApiResponse.error(res, 'Error fetching dashboard stats');
  }
});

// @route   GET api/dashboard/ai-insight
// @desc    Get AI-generated insight for the dashboard
// @access  Private
router.get('/ai-insight', auth, async (req, res) => {
  try {
    // Get recent check-ins to build a mood summary
    const recentCheckIns = await CheckIn.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(7);
    
    // Create a placeholder mood summary
    let moodSummary = 'User mood has been slightly low during the week but improving toward the weekend.';
    
    if (recentCheckIns.length > 0) {
      const moods = recentCheckIns.map(ci => ci.mood).filter(m => m);
      if (moods.length > 0) {
        const moodList = moods.join(', ');
        moodSummary = `Recent mood data: ${moodList}. Based on this data, provide wellness insights and suggestions.`;
      }
    }
    
    // Get AI-generated insight
    const aiInsight = await getSuggestions(moodSummary);
    
    ApiResponse.success(res, { insight: aiInsight }, 'AI insight generated');
  } catch (err) {
    logger.error('Failed to generate AI insight', { error: err.message, userId: req.user.id });
    ApiResponse.error(res, 'Failed to generate AI insight');
  }
});

module.exports = router;
