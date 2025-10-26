const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Book = require('../models/Book');
const { authenticateToken, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/digital
// @desc    Get digital resources
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('format').optional().isString(),
  query('category').optional().isString(),
  query('accessLevel').optional().isIn(['public', 'restricted'])
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
    
    const { search, format, category, accessLevel } = req.query;

    // Build filter object
    const filter = { isDigital: true };
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (format) {
      filter['digitalFile.format'] = format;
    }
    
    if (category) {
      filter.genre = { $in: [category] };
    }
    
    if (accessLevel) {
      filter.accessLevel = accessLevel;
    }

    const digitalResources = await Book.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('addedBy', 'firstName lastName')
      .lean();

    const total = await Book.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        resources: digitalResources,
        pagination: {
          currentPage: page,
          totalPages,
          totalResources: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get digital resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching digital resources'
    });
  }
});

// @route   GET /api/digital/search
// @desc    Search digital resources
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
      isDigital: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    })
    .sort({ 'rating.average': -1, views: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('addedBy', 'firstName lastName')
    .lean();

    const total = await Book.countDocuments({
      isDigital: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    });

    res.json({
      success: true,
      data: {
        resources: searchResults,
        query: q,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Search digital resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching digital resources'
    });
  }
});

// @route   GET /api/digital/:id
// @desc    Get single digital resource
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const resource = await Book.findOne({
      _id: req.params.id,
      isDigital: true
    })
    .populate('addedBy', 'firstName lastName')
    .lean();

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Digital resource not found'
      });
    }

    // Increment view count
    await Book.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    resource.views += 1;

    res.json({
      success: true,
      data: resource
    });

  } catch (error) {
    console.error('Get digital resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching digital resource'
    });
  }
});

// @route   GET /api/digital/:id/download
// @desc    Download digital resource
// @access  Private
router.get('/:id/download', [
  authenticateToken
], async (req, res) => {
  try {
    const resource = await Book.findOne({
      _id: req.params.id,
      isDigital: true
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Digital resource not found'
      });
    }

    if (!resource.digitalFile || !resource.digitalFile.url) {
      return res.status(400).json({
        success: false,
        message: 'Digital file not available'
      });
    }

    // Check access level
    if (resource.accessLevel === 'restricted' && req.user.role === 'user') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This resource requires special permissions.'
      });
    }

    // Log download activity
    console.log(`User ${req.user._id} downloaded resource ${resource._id}`);

    // Redirect to file URL or serve file directly
    res.redirect(resource.digitalFile.url);

  } catch (error) {
    console.error('Download digital resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while downloading digital resource'
    });
  }
});

// @route   GET /api/digital/:id/preview
// @desc    Preview digital resource
// @access  Public
router.get('/:id/preview', async (req, res) => {
  try {
    const resource = await Book.findOne({
      _id: req.params.id,
      isDigital: true
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Digital resource not found'
      });
    }

    if (!resource.digitalFile || !resource.digitalFile.url) {
      return res.status(400).json({
        success: false,
        message: 'Digital file not available'
      });
    }

    // For PDF files, you might want to use a PDF viewer
    if (resource.digitalFile.format === 'PDF') {
      res.json({
        success: true,
        data: {
          url: resource.digitalFile.url,
          format: resource.digitalFile.format,
          pages: resource.digitalFile.pages,
          size: resource.digitalFile.size
        }
      });
    } else {
      // For other formats, return the file URL
      res.json({
        success: true,
        data: {
          url: resource.digitalFile.url,
          format: resource.digitalFile.format,
          size: resource.digitalFile.size
        }
      });
    }

  } catch (error) {
    console.error('Preview digital resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while previewing digital resource'
    });
  }
});

// @route   GET /api/digital/categories
// @desc    Get digital resource categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Book.aggregate([
      { $match: { isDigital: true } },
      { $unwind: '$genre' },
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get digital categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching digital categories'
    });
  }
});

// @route   GET /api/digital/formats
// @desc    Get available digital formats
// @access  Public
router.get('/formats', async (req, res) => {
  try {
    const formats = await Book.aggregate([
      { $match: { isDigital: true, 'digitalFile.format': { $exists: true } } },
      { $group: { _id: '$digitalFile.format', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: formats
    });

  } catch (error) {
    console.error('Get digital formats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching digital formats'
    });
  }
});

// @route   POST /api/digital
// @desc    Add new digital resource
// @access  Private (Admin/Staff)
router.post('/', [
  authenticateToken,
  authorize('admin', 'staff'),
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('description').optional().isString(),
  body('genre').optional().isArray(),
  body('language').optional().isString(),
  body('digitalFile.url').notEmpty().withMessage('Digital file URL is required'),
  body('digitalFile.format').notEmpty().withMessage('Digital file format is required'),
  body('digitalFile.size').optional().isInt({ min: 0 }),
  body('digitalFile.pages').optional().isInt({ min: 1 }),
  body('accessLevel').optional().isIn(['public', 'restricted']),
  body('tags').optional().isArray()
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

    const digitalResourceData = {
      ...req.body,
      isDigital: true,
      totalCopies: 1,
      availableCopies: 1,
      addedBy: req.user._id
    };

    const digitalResource = new Book(digitalResourceData);
    await digitalResource.save();

    await digitalResource.populate('addedBy', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Digital resource added successfully',
      data: digitalResource
    });

  } catch (error) {
    console.error('Add digital resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding digital resource'
    });
  }
});

// @route   PUT /api/digital/:id
// @desc    Update digital resource
// @access  Private (Admin/Staff)
router.put('/:id', [
  authenticateToken,
  authorize('admin', 'staff'),
  body('title').optional().notEmpty(),
  body('author').optional().notEmpty(),
  body('description').optional().isString(),
  body('genre').optional().isArray(),
  body('language').optional().isString(),
  body('digitalFile.url').optional().notEmpty(),
  body('digitalFile.format').optional().notEmpty(),
  body('digitalFile.size').optional().isInt({ min: 0 }),
  body('digitalFile.pages').optional().isInt({ min: 1 }),
  body('accessLevel').optional().isIn(['public', 'restricted']),
  body('tags').optional().isArray()
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

    const digitalResource = await Book.findOneAndUpdate(
      { _id: req.params.id, isDigital: true },
      req.body,
      { new: true, runValidators: true }
    );

    if (!digitalResource) {
      return res.status(404).json({
        success: false,
        message: 'Digital resource not found'
      });
    }

    await digitalResource.populate('addedBy', 'firstName lastName');

    res.json({
      success: true,
      message: 'Digital resource updated successfully',
      data: digitalResource
    });

  } catch (error) {
    console.error('Update digital resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating digital resource'
    });
  }
});

// @route   DELETE /api/digital/:id
// @desc    Delete digital resource
// @access  Private (Admin)
router.delete('/:id', [
  authenticateToken,
  authorize('admin')
], async (req, res) => {
  try {
    const digitalResource = await Book.findOneAndDelete({
      _id: req.params.id,
      isDigital: true
    });

    if (!digitalResource) {
      return res.status(404).json({
        success: false,
        message: 'Digital resource not found'
      });
    }

    res.json({
      success: true,
      message: 'Digital resource deleted successfully'
    });

  } catch (error) {
    console.error('Delete digital resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting digital resource'
    });
  }
});

module.exports = router;
