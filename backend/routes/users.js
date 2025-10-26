const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const Borrowing = require('../models/Borrowing');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/', [
  authenticateToken,
  authorize('admin'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isString(),
  query('isActive').optional().isBoolean(),
  query('search').optional().isString()
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { role, isActive, search } = req.query;

    // Build filter object
    const filter = {};
    
    if (role) {
      filter.role = role;
    }
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', [
  authenticateToken
], async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;
    const currentUserRole = req.user.role;

    // Check if user can access this profile
    if (currentUserRole === 'user' && currentUserId.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const user = await User.findById(id)
      .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', [
  authenticateToken,
  body('firstName').optional().isLength({ min: 1, max: 50 }),
  body('lastName').optional().isLength({ min: 1, max: 50 }),
  body('phone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/),
  body('address.street').optional().isLength({ max: 100 }),
  body('address.city').optional().isLength({ max: 50 }),
  body('address.postalCode').optional().isLength({ max: 10 }),
  body('preferences.language').optional().isIn(['en', 'sq', 'sr']),
  body('preferences.notifications.email').optional().isBoolean(),
  body('preferences.notifications.sms').optional().isBoolean(),
  body('preferences.notifications.push').optional().isBoolean(),
  body('preferences.theme').optional().isIn(['light', 'dark', 'auto'])
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

    const { id } = req.params;
    const currentUserId = req.user._id;
    const currentUserRole = req.user.role;

    // Check if user can update this profile
    if (currentUserRole === 'user' && currentUserId.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const allowedUpdates = [
      'firstName', 'lastName', 'phone', 'address', 'dateOfBirth',
      'preferences.language', 'preferences.notifications', 'preferences.theme'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Staff and admin can update more fields
    if (currentUserRole === 'staff' || currentUserRole === 'admin') {
      if (req.body.role) updates.role = req.body.role;
      if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;
    }

    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin)
router.delete('/:id', [
  authenticateToken,
  authorize('admin')
], async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user'
    });
  }
});

// @route   GET /api/users/:id/borrowings
// @desc    Get user's borrowing history
// @access  Private
router.get('/:id/borrowings', [
  authenticateToken
], async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;
    const currentUserRole = req.user.role;

    // Check if user can access this data
    if (currentUserRole === 'user' && currentUserId.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { status, page = 1, limit = 10 } = req.query;

    const filter = { userId: id };
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const borrowings = await Borrowing.find(filter)
      .populate('bookId', 'title author coverImage isbn')
      .sort({ borrowDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Borrowing.countDocuments(filter);

    res.json({
      success: true,
      data: {
        borrowings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalBorrowings: total
        }
      }
    });

  } catch (error) {
    console.error('Get user borrowings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user borrowings'
    });
  }
});

// @route   GET /api/users/:id/fines
// @desc    Get user's fines
// @access  Private
router.get('/:id/fines', [
  authenticateToken
], async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;
    const currentUserRole = req.user.role;

    // Check if user can access this data
    if (currentUserRole === 'user' && currentUserId.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const totalFines = await Borrowing.calculateUserFines(id);
    const overdueBorrowings = await Borrowing.find({
      userId: id,
      status: 'overdue'
    })
    .populate('bookId', 'title author')
    .lean();

    res.json({
      success: true,
      data: {
        totalFines,
        overdueBorrowings
      }
    });

  } catch (error) {
    console.error('Get user fines error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user fines'
    });
  }
});

// @route   GET /api/users/stats/overview
// @desc    Get user statistics overview
// @access  Private (Admin/Staff)
router.get('/stats/overview', [
  authenticateToken,
  authorize('admin', 'staff')
], async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          newUsersThisMonth: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    '$createdAt',
                    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const roleStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear() - 1, 0, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalUsers: 0,
          activeUsers: 0,
          newUsersThisMonth: 0
        },
        roleStats,
        monthlyRegistrations
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user statistics'
    });
  }
});

module.exports = router;
