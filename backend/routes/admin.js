const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Book = require('../models/Book');
const User = require('../models/User');
const Borrowing = require('../models/Borrowing');
const Reservation = require('../models/Reservation');
const Event = require('../models/Event');
const News = require('../models/News');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin/Staff)
router.get('/dashboard', [
  authenticateToken,
  authorize('admin', 'staff')
], async (req, res) => {
  try {
    // Get overview statistics
    const [
      totalBooks,
      totalUsers,
      totalBorrowings,
      totalReservations,
      totalEvents,
      totalNews
    ] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments(),
      Borrowing.countDocuments(),
      Reservation.countDocuments(),
      Event.countDocuments(),
      News.countDocuments()
    ]);

    // Get active statistics
    const [
      activeBorrowings,
      pendingReservations,
      upcomingEvents,
      publishedNews
    ] = await Promise.all([
      Borrowing.countDocuments({ status: 'active' }),
      Reservation.countDocuments({ status: 'pending' }),
      Event.countDocuments({ 
        status: 'published',
        eventDate: { $gte: new Date() }
      }),
      News.countDocuments({ status: 'published' })
    ]);

    // Get monthly statistics
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

    const [
      monthlyBorrowings,
      monthlyRegistrations,
      monthlyEvents,
      monthlyNews
    ] = await Promise.all([
      Borrowing.countDocuments({ borrowDate: { $gte: startOfMonth } }),
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Event.countDocuments({ createdAt: { $gte: startOfMonth } }),
      News.countDocuments({ createdAt: { $gte: startOfMonth } })
    ]);

    // Get popular books
    const popularBooks = await Book.find()
      .sort({ borrowCount: -1 })
      .limit(5)
      .select('title author borrowCount')
      .lean();

    // Get recent activities
    const recentBorrowings = await Borrowing.find()
      .populate('userId', 'firstName lastName')
      .populate('bookId', 'title author')
      .sort({ borrowDate: -1 })
      .limit(5)
      .lean();

    const recentUsers = await User.find()
      .select('firstName lastName email createdAt')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      data: {
        overview: {
          totalBooks,
          totalUsers,
          totalBorrowings,
          totalReservations,
          totalEvents,
          totalNews
        },
        active: {
          activeBorrowings,
          pendingReservations,
          upcomingEvents,
          publishedNews
        },
        monthly: {
          monthlyBorrowings,
          monthlyRegistrations,
          monthlyEvents,
          monthlyNews
        },
        popularBooks,
        recentActivities: {
          recentBorrowings,
          recentUsers
        }
      }
    });

  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get detailed analytics
// @access  Private (Admin)
router.get('/analytics', [
  authenticateToken,
  authorize('admin')
], async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get borrowing trends
    const borrowingTrends = await Borrowing.aggregate([
      {
        $match: {
          borrowDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$borrowDate' },
            month: { $month: '$borrowDate' },
            day: { $dayOfMonth: '$borrowDate' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Get user registration trends
    const userTrends = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Get book categories distribution
    const bookCategories = await Book.aggregate([
      { $unwind: '$genre' },
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get user roles distribution
    const userRoles = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get overdue books
    const overdueBooks = await Borrowing.findOverdue()
      .populate('userId', 'firstName lastName email')
      .populate('bookId', 'title author')
      .lean();

    // Get top borrowers
    const topBorrowers = await Borrowing.aggregate([
      {
        $group: {
          _id: '$userId',
          borrowCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          userId: '$_id',
          firstName: '$user.firstName',
          lastName: '$user.lastName',
          email: '$user.email',
          borrowCount: 1
        }
      },
      {
        $sort: { borrowCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      data: {
        period,
        borrowingTrends,
        userTrends,
        bookCategories,
        userRoles,
        overdueBooks,
        topBorrowers
      }
    });

  } catch (error) {
    console.error('Get admin analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics data'
    });
  }
});

// @route   GET /api/admin/reports
// @desc    Generate reports
// @access  Private (Admin/Staff)
router.get('/reports', [
  authenticateToken,
  authorize('admin', 'staff'),
  query('type').isIn(['borrowings', 'users', 'books', 'events', 'news']).withMessage('Invalid report type'),
  query('format').optional().isIn(['json', 'csv']).withMessage('Invalid format'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { type, format = 'json', startDate, endDate } = req.query;
    
    let reportData;
    const dateFilter = {};
    
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    switch (type) {
      case 'borrowings':
        const borrowingsFilter = {};
        if (Object.keys(dateFilter).length > 0) {
          borrowingsFilter.borrowDate = dateFilter;
        }
        
        reportData = await Borrowing.find(borrowingsFilter)
          .populate('userId', 'firstName lastName email')
          .populate('bookId', 'title author isbn')
          .sort({ borrowDate: -1 })
          .lean();
        break;

      case 'users':
        const usersFilter = {};
        if (Object.keys(dateFilter).length > 0) {
          usersFilter.createdAt = dateFilter;
        }
        
        reportData = await User.find(usersFilter)
          .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires')
          .sort({ createdAt: -1 })
          .lean();
        break;

      case 'books':
        reportData = await Book.find()
          .populate('addedBy', 'firstName lastName')
          .sort({ createdAt: -1 })
          .lean();
        break;

      case 'events':
        const eventsFilter = {};
        if (Object.keys(dateFilter).length > 0) {
          eventsFilter.eventDate = dateFilter;
        }
        
        reportData = await Event.find(eventsFilter)
          .populate('createdBy', 'firstName lastName')
          .sort({ eventDate: -1 })
          .lean();
        break;

      case 'news':
        const newsFilter = {};
        if (Object.keys(dateFilter).length > 0) {
          newsFilter.publishDate = dateFilter;
        }
        
        reportData = await News.find(newsFilter)
          .populate('author', 'firstName lastName')
          .sort({ publishDate: -1 })
          .lean();
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }

    if (format === 'csv') {
      // Convert to CSV format
      const csv = convertToCSV(reportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${type}-report.csv"`);
      return res.send(csv);
    }

    res.json({
      success: true,
      data: {
        type,
        format,
        dateRange: { startDate, endDate },
        totalRecords: reportData.length,
        records: reportData
      }
    });

  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating report'
    });
  }
});

// @route   POST /api/admin/notifications
// @desc    Send notifications to users
// @access  Private (Admin/Staff)
router.post('/notifications', [
  authenticateToken,
  authorize('admin', 'staff'),
  body('type').isIn(['email', 'sms', 'push']).withMessage('Invalid notification type'),
  body('recipients').isIn(['all', 'active', 'overdue']).withMessage('Invalid recipient type'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { type, recipients, subject, message } = req.body;

    // Get recipient users based on type
    let userFilter = {};
    
    switch (recipients) {
      case 'active':
        userFilter.isActive = true;
        break;
      case 'overdue':
        // Get users with overdue books
        const overdueUserIds = await Borrowing.findOverdue().distinct('userId');
        userFilter._id = { $in: overdueUserIds };
        break;
      case 'all':
      default:
        // All users
        break;
    }

    const users = await User.find(userFilter).select('email firstName lastName');
    
    // Here you would integrate with your notification service
    // For now, we'll just log the notification
    console.log(`Sending ${type} notification to ${users.length} users:`, {
      subject,
      message,
      recipients: users.map(u => u.email)
    });

    res.json({
      success: true,
      message: `Notification sent to ${users.length} users`,
      data: {
        type,
        recipients: users.length,
        subject,
        message
      }
    });

  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending notification'
    });
  }
});

// Helper function to convert data to CSV
function convertToCSV(data) {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value);
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
}

module.exports = router;
