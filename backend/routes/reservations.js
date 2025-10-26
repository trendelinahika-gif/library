const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Reservation = require('../models/Reservation');
const Book = require('../models/Book');
const User = require('../models/User');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/reservations
// @desc    Create a new reservation
// @access  Private
router.post('/', [
  authenticateToken,
  body('bookId').notEmpty().withMessage('Book ID is required')
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

    const { bookId } = req.body;
    const userId = req.user._id;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if user already has an active reservation for this book
    const existingReservation = await Reservation.findOne({
      userId,
      bookId,
      status: 'pending'
    });

    if (existingReservation) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending reservation for this book'
      });
    }

    // Check if user already has this book borrowed
    const Borrowing = require('../models/Borrowing');
    const activeBorrowing = await Borrowing.findOne({
      userId,
      bookId,
      status: 'active'
    });

    if (activeBorrowing) {
      return res.status(400).json({
        success: false,
        message: 'You already have this book borrowed'
      });
    }

    // Create reservation
    const reservation = new Reservation({
      userId,
      bookId
    });

    await reservation.save();

    // Update priorities for this book
    await Reservation.updatePriorities(bookId);

    // Get user's position in queue
    const position = await Reservation.getUserPosition(userId, bookId);

    await reservation.populate([
      { path: 'bookId', select: 'title author coverImage' },
      { path: 'userId', select: 'firstName lastName email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: {
        ...reservation.toObject(),
        position
      }
    });

  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating reservation'
    });
  }
});

// @route   GET /api/reservations/user/:userId
// @desc    Get user's reservations
// @access  Private
router.get('/user/:userId', [
  authenticateToken
], async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;
    const currentUserRole = req.user.role;

    // Check if user can access this data
    if (currentUserRole === 'user' && currentUserId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { status, page = 1, limit = 10 } = req.query;

    const filter = { userId };
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reservations = await Reservation.find(filter)
      .populate('bookId', 'title author coverImage isbn availableCopies')
      .populate('userId', 'firstName lastName email')
      .sort({ reservationDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Reservation.countDocuments(filter);

    // Get position in queue for each reservation
    const reservationsWithPosition = await Promise.all(
      reservations.map(async (reservation) => {
        if (reservation.status === 'pending') {
          const position = await Reservation.getUserPosition(userId, reservation.bookId._id);
          return { ...reservation, position };
        }
        return reservation;
      })
    );

    res.json({
      success: true,
      data: {
        reservations: reservationsWithPosition,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalReservations: total
        }
      }
    });

  } catch (error) {
    console.error('Get user reservations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reservations'
    });
  }
});

// @route   GET /api/reservations/book/:bookId
// @desc    Get reservations for a specific book
// @access  Private (Staff/Admin)
router.get('/book/:bookId', [
  authenticateToken,
  authorize('staff', 'admin')
], async (req, res) => {
  try {
    const { bookId } = req.params;
    const { status = 'pending' } = req.query;

    const reservations = await Reservation.find({
      bookId,
      status
    })
    .populate('userId', 'firstName lastName email phone')
    .populate('bookId', 'title author')
    .sort({ priority: 1, reservationDate: 1 })
    .lean();

    res.json({
      success: true,
      data: reservations
    });

  } catch (error) {
    console.error('Get book reservations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching book reservations'
    });
  }
});

// @route   PUT /api/reservations/:id/cancel
// @desc    Cancel a reservation
// @access  Private
router.put('/:id/cancel', [
  authenticateToken
], async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Check if user can cancel this reservation
    if (reservation.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (reservation.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending reservations can be cancelled'
      });
    }

    // Update reservation status
    reservation.status = 'cancelled';
    reservation.cancelledDate = new Date();
    await reservation.save();

    // Update priorities for this book
    await Reservation.updatePriorities(reservation.bookId);

    res.json({
      success: true,
      message: 'Reservation cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling reservation'
    });
  }
});

// @route   PUT /api/reservations/:id/fulfill
// @desc    Fulfill a reservation (Staff/Admin)
// @access  Private (Staff/Admin)
router.put('/:id/fulfill', [
  authenticateToken,
  authorize('staff', 'admin')
], async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    if (reservation.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending reservations can be fulfilled'
      });
    }

    // Check if book is available
    const book = await Book.findById(reservation.bookId);
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for borrowing'
      });
    }

    // Update reservation status
    reservation.status = 'fulfilled';
    reservation.fulfilledDate = new Date();
    reservation.processedBy = req.user._id;
    await reservation.save();

    // Update priorities for this book
    await Reservation.updatePriorities(reservation.bookId);

    res.json({
      success: true,
      message: 'Reservation fulfilled successfully'
    });

  } catch (error) {
    console.error('Fulfill reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fulfilling reservation'
    });
  }
});

// @route   GET /api/reservations/expired
// @desc    Get expired reservations
// @access  Private (Staff/Admin)
router.get('/expired', [
  authenticateToken,
  authorize('staff', 'admin')
], async (req, res) => {
  try {
    const expiredReservations = await Reservation.findExpired()
      .populate('userId', 'firstName lastName email phone')
      .populate('bookId', 'title author isbn')
      .sort({ expiryDate: 1 })
      .lean();

    res.json({
      success: true,
      data: expiredReservations
    });

  } catch (error) {
    console.error('Get expired reservations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching expired reservations'
    });
  }
});

// @route   GET /api/reservations/stats
// @desc    Get reservation statistics
// @access  Private (Staff/Admin)
router.get('/stats', [
  authenticateToken,
  authorize('staff', 'admin')
], async (req, res) => {
  try {
    const stats = await Reservation.aggregate([
      {
        $group: {
          _id: null,
          totalReservations: { $sum: 1 },
          pendingReservations: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          fulfilledReservations: {
            $sum: { $cond: [{ $eq: ['$status', 'fulfilled'] }, 1, 0] }
          },
          cancelledReservations: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          expiredReservations: {
            $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] }
          }
        }
      }
    ]);

    const monthlyStats = await Reservation.aggregate([
      {
        $match: {
          reservationDate: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$reservationDate' },
            month: { $month: '$reservationDate' }
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
          totalReservations: 0,
          pendingReservations: 0,
          fulfilledReservations: 0,
          cancelledReservations: 0,
          expiredReservations: 0
        },
        monthlyStats
      }
    });

  } catch (error) {
    console.error('Get reservation stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reservation statistics'
    });
  }
});

module.exports = router;
