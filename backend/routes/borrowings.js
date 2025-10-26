const express = require('express');
const { body, validationResult } = require('express-validator');
const Borrowing = require('../models/Borrowing');
const Book = require('../models/Book');
const User = require('../models/User');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/borrowings
// @desc    Borrow a book
// @access  Private
router.post('/', [
  authenticateToken,
  body('bookId').notEmpty().withMessage('Book ID is required'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date')
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

    const { bookId, dueDate } = req.body;
    const userId = req.user._id;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for borrowing'
      });
    }

    // Check if user already has this book borrowed
    const existingBorrowing = await Borrowing.findOne({
      userId,
      bookId,
      status: 'active'
    });

    if (existingBorrowing) {
      return res.status(400).json({
        success: false,
        message: 'You already have this book borrowed'
      });
    }

    // Check user's borrowing limit (e.g., max 5 books)
    const userBorrowings = await Borrowing.countDocuments({
      userId,
      status: 'active'
    });

    if (userBorrowings >= 5) {
      return res.status(400).json({
        success: false,
        message: 'You have reached the maximum borrowing limit'
      });
    }

    // Check for outstanding fines
    const userFines = await Borrowing.calculateUserFines(userId);
    if (userFines > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have outstanding fines. Please pay them before borrowing more books.'
      });
    }

    // Set default due date (14 days from now)
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);
    const finalDueDate = dueDate ? new Date(dueDate) : defaultDueDate;

    // Create borrowing record
    const borrowing = new Borrowing({
      userId,
      bookId,
      dueDate: finalDueDate,
      processedBy: req.user._id
    });

    await borrowing.save();

    // Update book availability
    await Book.findByIdAndUpdate(bookId, {
      $inc: { availableCopies: -1, borrowCount: 1 },
      $set: { lastBorrowed: new Date() }
    });

    // Populate the borrowing with book and user details
    await borrowing.populate([
      { path: 'bookId', select: 'title author coverImage' },
      { path: 'userId', select: 'firstName lastName email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: borrowing
    });

  } catch (error) {
    console.error('Borrow book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while borrowing book'
    });
  }
});

// @route   GET /api/borrowings/user/:userId
// @desc    Get user's borrowings
// @access  Private
router.get('/user/:userId', [
  authenticateToken,
  authorize('user', 'staff', 'admin')
], async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    // Check if user can access this data
    if (req.user.role === 'user' && req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const filter = { userId };
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const borrowings = await Borrowing.find(filter)
      .populate('bookId', 'title author coverImage isbn')
      .populate('userId', 'firstName lastName email')
      .populate('processedBy', 'firstName lastName')
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
      message: 'Server error while fetching borrowings'
    });
  }
});

// @route   PUT /api/borrowings/:id/return
// @desc    Return a book
// @access  Private (Staff/Admin)
router.put('/:id/return', [
  authenticateToken,
  authorize('staff', 'admin'),
  body('notes').optional().isString()
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
    const { notes } = req.body;

    const borrowing = await Borrowing.findById(id);
    if (!borrowing) {
      return res.status(404).json({
        success: false,
        message: 'Borrowing record not found'
      });
    }

    if (borrowing.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Book is not currently borrowed'
      });
    }

    // Update borrowing record
    borrowing.status = 'returned';
    borrowing.returnDate = new Date();
    borrowing.returnedBy = req.user._id;
    if (notes) {
      borrowing.notes = notes;
    }

    await borrowing.save();

    // Update book availability
    await Book.findByIdAndUpdate(borrowing.bookId, {
      $inc: { availableCopies: 1 }
    });

    // Populate the updated borrowing
    await borrowing.populate([
      { path: 'bookId', select: 'title author' },
      { path: 'userId', select: 'firstName lastName email' },
      { path: 'returnedBy', select: 'firstName lastName' }
    ]);

    res.json({
      success: true,
      message: 'Book returned successfully',
      data: borrowing
    });

  } catch (error) {
    console.error('Return book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while returning book'
    });
  }
});

// @route   POST /api/borrowings/:id/renew
// @desc    Renew a book
// @access  Private
router.post('/:id/renew', [
  authenticateToken
], async (req, res) => {
  try {
    const { id } = req.params;

    const borrowing = await Borrowing.findById(id);
    if (!borrowing) {
      return res.status(404).json({
        success: false,
        message: 'Borrowing record not found'
      });
    }

    // Check if user can renew this book
    if (borrowing.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (borrowing.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Book is not currently borrowed'
      });
    }

    if (!borrowing.canRenew) {
      return res.status(400).json({
        success: false,
        message: 'This book cannot be renewed'
      });
    }

    // Extend due date by 14 days
    const newDueDate = new Date(borrowing.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 14);

    borrowing.dueDate = newDueDate;
    borrowing.renewalCount += 1;
    borrowing.lastRenewalDate = new Date();

    await borrowing.save();

    res.json({
      success: true,
      message: 'Book renewed successfully',
      data: {
        newDueDate,
        renewalCount: borrowing.renewalCount
      }
    });

  } catch (error) {
    console.error('Renew book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while renewing book'
    });
  }
});

// @route   GET /api/borrowings/overdue
// @desc    Get overdue borrowings
// @access  Private (Staff/Admin)
router.get('/overdue', [
  authenticateToken,
  authorize('staff', 'admin')
], async (req, res) => {
  try {
    const overdueBorrowings = await Borrowing.findOverdue()
      .populate('bookId', 'title author isbn')
      .populate('userId', 'firstName lastName email phone')
      .sort({ dueDate: 1 })
      .lean();

    res.json({
      success: true,
      data: overdueBorrowings
    });

  } catch (error) {
    console.error('Get overdue borrowings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching overdue borrowings'
    });
  }
});

// @route   GET /api/borrowings/stats
// @desc    Get borrowing statistics
// @access  Private (Staff/Admin)
router.get('/stats', [
  authenticateToken,
  authorize('staff', 'admin')
], async (req, res) => {
  try {
    const stats = await Borrowing.aggregate([
      {
        $group: {
          _id: null,
          totalBorrowings: { $sum: 1 },
          activeBorrowings: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          returnedBorrowings: {
            $sum: { $cond: [{ $eq: ['$status', 'returned'] }, 1, 0] }
          },
          overdueBorrowings: {
            $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] }
          },
          totalFines: { $sum: '$fineAmount' }
        }
      }
    ]);

    const monthlyStats = await Borrowing.aggregate([
      {
        $match: {
          borrowDate: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$borrowDate' },
            month: { $month: '$borrowDate' }
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
          totalBorrowings: 0,
          activeBorrowings: 0,
          returnedBorrowings: 0,
          overdueBorrowings: 0,
          totalFines: 0
        },
        monthlyStats
      }
    });

  } catch (error) {
    console.error('Get borrowing stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching borrowing statistics'
    });
  }
});

module.exports = router;
