const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Book = require('../models/Book');
const { authenticateToken, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/books
// @desc    Get all books with pagination and filtering
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('genre').optional().isString().withMessage('Genre must be a string'),
  query('language').optional().isString().withMessage('Language must be a string'),
  query('sort').optional().isIn(['title', 'author', 'publicationYear', 'rating', 'createdAt']).withMessage('Invalid sort field'),
  query('order').optional().isIn(['asc', 'desc']).withMessage('Order must be asc or desc')
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
    
    const {
      search,
      genre,
      language,
      sort = 'createdAt',
      order = 'desc',
      isFeatured,
      isNewArrival,
      isBestseller
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (genre) {
      filter.genre = { $in: genre.split(',') };
    }
    
    if (language) {
      filter.language = language;
    }
    
    if (isFeatured === 'true') {
      filter.isFeatured = true;
    }
    
    if (isNewArrival === 'true') {
      filter.isNewArrival = true;
    }
    
    if (isBestseller === 'true') {
      filter.isBestseller = true;
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    const books = await Book.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate('addedBy', 'firstName lastName')
      .lean();

    const total = await Book.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        books,
        pagination: {
          currentPage: page,
          totalPages,
          totalBooks: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching books'
    });
  }
});

// @route   GET /api/books/search
// @desc    Search books with advanced filters
// @access  Public
router.get('/search', [
  query('q').notEmpty().withMessage('Search query is required'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
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

    const { q, page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const searchResults = await Book.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { isbn: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    })
    .sort({ 'rating.average': -1, borrowCount: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('addedBy', 'firstName lastName')
    .lean();

    const total = await Book.countDocuments({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { isbn: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    });

    res.json({
      success: true,
      data: {
        books: searchResults,
        query: q,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Search books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching books'
    });
  }
});

// @route   GET /api/books/:id
// @desc    Get single book by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('addedBy', 'firstName lastName')
      .lean();

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Increment view count
    await Book.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: book
    });

  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching book'
    });
  }
});

// @route   POST /api/books
// @desc    Add new book
// @access  Private (Admin/Staff)
router.post('/', [
  authenticateToken,
  authorize('admin', 'staff'),
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('description').optional().isString(),
  body('isbn').optional().isString(),
  body('genre').optional().isArray(),
  body('language').optional().isString(),
  body('publicationYear').optional().isInt({ min: 1000, max: new Date().getFullYear() }),
  body('publisher').optional().isString(),
  body('pages').optional().isInt({ min: 1 }),
  body('totalCopies').isInt({ min: 1 }).withMessage('Total copies must be at least 1'),
  body('location.section').optional().isString(),
  body('location.shelf').optional().isString(),
  body('location.floor').optional().isInt({ min: 0 }),
  body('tags').optional().isArray(),
  body('isDigital').optional().isBoolean(),
  body('digitalFile.url').optional().isString(),
  body('digitalFile.format').optional().isString(),
  body('digitalFile.size').optional().isInt({ min: 0 }),
  body('digitalFile.pages').optional().isInt({ min: 1 })
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

    const bookData = {
      ...req.body,
      addedBy: req.user._id
    };

    const book = new Book(bookData);
    await book.save();

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: book
    });

  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding book'
    });
  }
});

// @route   PUT /api/books/:id
// @desc    Update book
// @access  Private (Admin/Staff)
router.put('/:id', [
  authenticateToken,
  authorize('admin', 'staff'),
  body('title').optional().notEmpty(),
  body('author').optional().notEmpty(),
  body('description').optional().isString(),
  body('isbn').optional().isString(),
  body('genre').optional().isArray(),
  body('language').optional().isString(),
  body('publicationYear').optional().isInt({ min: 1000, max: new Date().getFullYear() }),
  body('publisher').optional().isString(),
  body('pages').optional().isInt({ min: 1 }),
  body('totalCopies').optional().isInt({ min: 1 }),
  body('location.section').optional().isString(),
  body('location.shelf').optional().isString(),
  body('location.floor').optional().isInt({ min: 0 }),
  body('tags').optional().isArray(),
  body('isDigital').optional().isBoolean(),
  body('digitalFile.url').optional().isString(),
  body('digitalFile.format').optional().isString(),
  body('digitalFile.size').optional().isInt({ min: 0 }),
  body('digitalFile.pages').optional().isInt({ min: 1 })
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

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });

  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating book'
    });
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete book
// @access  Private (Admin)
router.delete('/:id', [
  authenticateToken,
  authorize('admin')
], async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });

  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting book'
    });
  }
});

// @route   GET /api/books/featured
// @desc    Get featured books
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const featuredBooks = await Book.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('addedBy', 'firstName lastName')
      .lean();

    res.json({
      success: true,
      data: featuredBooks
    });

  } catch (error) {
    console.error('Get featured books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured books'
    });
  }
});

// @route   GET /api/books/new-arrivals
// @desc    Get new arrival books
// @access  Public
router.get('/new-arrivals', async (req, res) => {
  try {
    const newArrivals = await Book.find({ isNewArrival: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('addedBy', 'firstName lastName')
      .lean();

    res.json({
      success: true,
      data: newArrivals
    });

  } catch (error) {
    console.error('Get new arrivals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching new arrivals'
    });
  }
});

// @route   GET /api/books/bestsellers
// @desc    Get bestseller books
// @access  Public
router.get('/bestsellers', async (req, res) => {
  try {
    const bestsellers = await Book.find({ isBestseller: true })
      .sort({ borrowCount: -1, 'rating.average': -1 })
      .limit(8)
      .populate('addedBy', 'firstName lastName')
      .lean();

    res.json({
      success: true,
      data: bestsellers
    });

  } catch (error) {
    console.error('Get bestsellers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bestsellers'
    });
  }
});

module.exports = router;
