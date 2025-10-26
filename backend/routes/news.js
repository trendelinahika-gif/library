const express = require('express');
const { body, validationResult, query } = require('express-validator');
const News = require('../models/News');
const { authenticateToken, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/news
// @desc    Get all news articles with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isString(),
  query('isFeatured').optional().isBoolean(),
  query('language').optional().isString()
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
    
    const { category, isFeatured, language } = req.query;

    // Build filter object
    const filter = { 
      status: 'published',
      publishDate: { $lte: new Date() },
      $or: [
        { expiryDate: null },
        { expiryDate: { $gt: new Date() } }
      ]
    };
    
    if (category) {
      filter.category = category;
    }
    
    if (isFeatured === 'true') {
      filter.isFeatured = true;
    }
    
    if (language) {
      filter.language = language;
    }

    const news = await News.find(filter)
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'firstName lastName profileImage')
      .lean();

    const total = await News.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        news,
        pagination: {
          currentPage: page,
          totalPages,
          totalNews: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching news'
    });
  }
});

// @route   GET /api/news/featured
// @desc    Get featured news articles
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const featuredNews = await News.findFeatured(5);
    
    res.json({
      success: true,
      data: featuredNews
    });

  } catch (error) {
    console.error('Get featured news error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured news'
    });
  }
});

// @route   GET /api/news/search
// @desc    Search news articles
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

    const searchResults = await News.search(q, parseInt(limit));
    const total = await News.countDocuments({
      status: 'published',
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    });

    res.json({
      success: true,
      data: {
        news: searchResults,
        query: q,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Search news error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching news'
    });
  }
});

// @route   GET /api/news/:slug
// @desc    Get single news article by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const news = await News.findOne({ slug: req.params.slug })
      .populate('author', 'firstName lastName profileImage')
      .lean();

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    // Increment view count
    await News.findByIdAndUpdate(news._id, { $inc: { views: 1 } });
    news.views += 1;

    res.json({
      success: true,
      data: news
    });

  } catch (error) {
    console.error('Get news article error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching news article'
    });
  }
});

// @route   POST /api/news
// @desc    Create new news article
// @access  Private (Admin/Staff)
router.post('/', [
  authenticateToken,
  authorize('admin', 'staff'),
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('language').optional().isIn(['en', 'sq', 'sr']),
  body('tags').optional().isArray(),
  body('isFeatured').optional().isBoolean(),
  body('isBreaking').optional().isBoolean(),
  body('publishDate').optional().isISO8601()
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

    const newsData = {
      ...req.body,
      author: req.user._id
    };

    const news = new News(newsData);
    await news.save();

    await news.populate('author', 'firstName lastName profileImage');

    res.status(201).json({
      success: true,
      message: 'News article created successfully',
      data: news
    });

  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating news article'
    });
  }
});

// @route   PUT /api/news/:id
// @desc    Update news article
// @access  Private (Admin/Staff)
router.put('/:id', [
  authenticateToken,
  authorize('admin', 'staff'),
  body('title').optional().notEmpty(),
  body('content').optional().notEmpty(),
  body('category').optional().notEmpty(),
  body('language').optional().isIn(['en', 'sq', 'sr']),
  body('tags').optional().isArray(),
  body('isFeatured').optional().isBoolean(),
  body('isBreaking').optional().isBoolean(),
  body('publishDate').optional().isISO8601()
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

    const news = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    await news.populate('author', 'firstName lastName profileImage');

    res.json({
      success: true,
      message: 'News article updated successfully',
      data: news
    });

  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating news article'
    });
  }
});

// @route   DELETE /api/news/:id
// @desc    Delete news article
// @access  Private (Admin)
router.delete('/:id', [
  authenticateToken,
  authorize('admin')
], async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    res.json({
      success: true,
      message: 'News article deleted successfully'
    });

  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting news article'
    });
  }
});

// @route   POST /api/news/:id/like
// @desc    Like a news article
// @access  Private
router.post('/:id/like', [
  authenticateToken
], async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    res.json({
      success: true,
      message: 'News article liked successfully',
      data: { likes: news.likes }
    });

  } catch (error) {
    console.error('Like news error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while liking news article'
    });
  }
});

// @route   POST /api/news/:id/share
// @desc    Share a news article
// @access  Private
router.post('/:id/share', [
  authenticateToken
], async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { shares: 1 } },
      { new: true }
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    res.json({
      success: true,
      message: 'News article shared successfully',
      data: { shares: news.shares }
    });

  } catch (error) {
    console.error('Share news error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sharing news article'
    });
  }
});

module.exports = router;
