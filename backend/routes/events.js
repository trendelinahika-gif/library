const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Event = require('../models/Event');
const { authenticateToken, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isString(),
  query('isUpcoming').optional().isBoolean(),
  query('isFeatured').optional().isBoolean()
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
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    const { category, isUpcoming, isFeatured } = req.query;

    // Build filter object
    const filter = { status: 'published' };
    
    if (category) {
      filter.category = category;
    }
    
    if (isUpcoming === 'true') {
      filter.eventDate = { $gte: new Date() };
    }
    
    if (isFeatured === 'true') {
      filter.isFeatured = true;
    }

    const events = await Event.find(filter)
      .sort({ eventDate: 1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'firstName lastName')
      .lean();

    const total = await Event.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          currentPage: page,
          totalPages,
          totalEvents: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events'
    });
  }
});

// @route   GET /api/events/upcoming
// @desc    Get upcoming events
// @access  Public
router.get('/upcoming', async (req, res) => {
  try {
    const upcomingEvents = await Event.findUpcoming(10);
    
    res.json({
      success: true,
      data: upcomingEvents
    });

  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching upcoming events'
    });
  }
});

// @route   GET /api/events/featured
// @desc    Get featured events
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const featuredEvents = await Event.find({ 
      isFeatured: true, 
      status: 'published',
      eventDate: { $gte: new Date() }
    })
    .sort({ eventDate: 1 })
    .limit(6)
    .populate('createdBy', 'firstName lastName')
    .lean();

    res.json({
      success: true,
      data: featuredEvents
    });

  } catch (error) {
    console.error('Get featured events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured events'
    });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email')
      .lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });

  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event'
    });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (Admin/Staff)
router.post('/', [
  authenticateToken,
  authorize('admin', 'staff'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('eventDate').isISO8601().withMessage('Event date is required'),
  body('endDate').isISO8601().withMessage('End date is required'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time format'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid end time format'),
  body('location.name').notEmpty().withMessage('Location name is required'),
  body('location.address').notEmpty().withMessage('Location address is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('organizer.name').notEmpty().withMessage('Organizer name is required')
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

    const eventData = {
      ...req.body,
      createdBy: req.user._id
    };

    const event = new Event(eventData);
    await event.save();

    await event.populate('createdBy', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating event'
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Admin/Staff)
router.put('/:id', [
  authenticateToken,
  authorize('admin', 'staff'),
  body('title').optional().notEmpty(),
  body('description').optional().notEmpty(),
  body('eventDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('startTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('endTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('location.name').optional().notEmpty(),
  body('location.address').optional().notEmpty(),
  body('category').optional().notEmpty(),
  body('organizer.name').optional().notEmpty()
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

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await event.populate('createdBy', 'firstName lastName');

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating event'
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Admin)
router.delete('/:id', [
  authenticateToken,
  authorize('admin')
], async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting event'
    });
  }
});

// @route   POST /api/events/:id/register
// @desc    Register for an event
// @access  Private
router.post('/:id/register', [
  authenticateToken
], async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (!event.canRegister) {
      return res.status(400).json({
        success: false,
        message: 'Registration is not available for this event'
      });
    }

    // Check if user is already registered
    const existingRegistration = event.attendees.find(
      attendee => attendee.userId.toString() === userId.toString()
    );

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Add user to attendees
    event.attendees.push({
      userId,
      registeredAt: new Date(),
      status: 'registered'
    });

    await event.save();

    res.json({
      success: true,
      message: 'Successfully registered for the event',
      data: {
        eventId: event._id,
        eventTitle: event.title,
        eventDate: event.eventDate,
        spotsRemaining: event.spotsRemaining
      }
    });

  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while registering for event'
    });
  }
});

// @route   DELETE /api/events/:id/register
// @desc    Cancel event registration
// @access  Private
router.delete('/:id/register', [
  authenticateToken
], async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Find and remove user from attendees
    const attendeeIndex = event.attendees.findIndex(
      attendee => attendee.userId.toString() === userId.toString()
    );

    if (attendeeIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not registered for this event'
      });
    }

    event.attendees.splice(attendeeIndex, 1);
    await event.save();

    res.json({
      success: true,
      message: 'Successfully cancelled event registration'
    });

  } catch (error) {
    console.error('Cancel event registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling event registration'
    });
  }
});

module.exports = router;
