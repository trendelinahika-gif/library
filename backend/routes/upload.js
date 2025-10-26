const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'library-kosovo',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt', 'epub', 'mobi'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 5 // Maximum 5 files at once
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'application/epub+zip', 'application/x-mobipocket-ebook'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, documents, and eBooks are allowed.'), false);
    }
  }
});

// @route   POST /api/upload/image
// @desc    Upload image files
// @access  Private (Admin/Staff)
router.post('/image', [
  authenticateToken,
  authorize('admin', 'staff'),
  upload.single('image')
], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: req.file.path,
        publicId: req.file.filename,
        format: req.file.format,
        size: req.file.size,
        width: req.file.width,
        height: req.file.height
      }
    });

  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading image'
    });
  }
});

// @route   POST /api/upload/images
// @desc    Upload multiple image files
// @access  Private (Admin/Staff)
router.post('/images', [
  authenticateToken,
  authorize('admin', 'staff'),
  upload.array('images', 5)
], async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    const uploadedImages = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      format: file.format,
      size: file.size,
      width: file.width,
      height: file.height
    }));

    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      data: uploadedImages
    });

  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading images'
    });
  }
});

// @route   POST /api/upload/document
// @desc    Upload document files (PDF, DOC, etc.)
// @access  Private (Admin/Staff)
router.post('/document', [
  authenticateToken,
  authorize('admin', 'staff'),
  upload.single('document')
], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No document file provided'
      });
    }

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        url: req.file.path,
        publicId: req.file.filename,
        format: req.file.format,
        size: req.file.size
      }
    });

  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading document'
    });
  }
});

// @route   POST /api/upload/ebook
// @desc    Upload eBook files
// @access  Private (Admin/Staff)
router.post('/ebook', [
  authenticateToken,
  authorize('admin', 'staff'),
  upload.single('ebook')
], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No eBook file provided'
      });
    }

    res.json({
      success: true,
      message: 'eBook uploaded successfully',
      data: {
        url: req.file.path,
        publicId: req.file.filename,
        format: req.file.format,
        size: req.file.size
      }
    });

  } catch (error) {
    console.error('Upload eBook error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading eBook'
    });
  }
});

// @route   DELETE /api/upload/:publicId
// @desc    Delete uploaded file
// @access  Private (Admin/Staff)
router.delete('/:publicId', [
  authenticateToken,
  authorize('admin', 'staff')
], async (req, res) => {
  try {
    const { publicId } = req.params;

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting file'
    });
  }
});

// @route   GET /api/upload/files
// @desc    Get list of uploaded files
// @access  Private (Admin/Staff)
router.get('/files', [
  authenticateToken,
  authorize('admin', 'staff')
], async (req, res) => {
  try {
    const { folder = 'library-kosovo', maxResults = 50 } = req.query;

    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: parseInt(maxResults)
    });

    res.json({
      success: true,
      data: {
        files: result.resources,
        total: result.total_count
      }
    });

  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching files'
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 50MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 5 files at once.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name.'
      });
    }
  }
  
  if (error.message) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Upload error'
  });
});

module.exports = router;
