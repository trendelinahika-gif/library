const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'News title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'News content is required'],
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  featuredImage: {
    type: String,
    default: null
  },
  images: [{
    url: String,
    caption: String,
    alt: String
  }],
  category: {
    type: String,
    enum: [
      'General', 'Announcements', 'Events', 'New Arrivals', 'Library News',
      'Cultural', 'Educational', 'Technology', 'Community', 'Awards',
      'Partnerships', 'Services', 'Collections', 'Research', 'Other'
    ],
    required: [true, 'News category is required'],
    default: 'General'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBreaking: {
    type: Boolean,
    default: false
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    default: null
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  shares: {
    type: Number,
    default: 0,
    min: 0
  },
  language: {
    type: String,
    enum: ['en', 'sq', 'sr'],
    default: 'en'
  },
  isMultilingual: {
    type: Boolean,
    default: false
  },
  translations: [{
    language: {
      type: String,
      enum: ['en', 'sq', 'sr']
    },
    title: String,
    content: String,
    excerpt: String
  }],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  socialMedia: {
    facebook: {
      title: String,
      description: String,
      image: String
    },
    twitter: {
      title: String,
      description: String,
      image: String
    }
  },
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  }],
  allowComments: {
    type: Boolean,
    default: true
  },
  relatedNews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News'
  }],
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reading time (estimated)
newsSchema.virtual('readingTime').get(function() {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
});

// Virtual for is published
newsSchema.virtual('isPublished').get(function() {
  return this.status === 'published' && this.publishDate <= new Date();
});

// Virtual for is expired
newsSchema.virtual('isExpired').get(function() {
  return this.expiryDate && new Date() > this.expiryDate;
});

// Virtual for approved comments count
newsSchema.virtual('approvedCommentsCount').get(function() {
  return this.comments.filter(comment => comment.isApproved).length;
});

// Pre-save middleware to generate slug
newsSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Pre-save middleware to generate excerpt
newsSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.excerpt) {
    this.excerpt = this.content.substring(0, 200).replace(/<[^>]*>/g, '') + '...';
  }
  next();
});

// Static method to find published news
newsSchema.statics.findPublished = function(limit = 10, skip = 0) {
  return this.find({
    status: 'published',
    publishDate: { $lte: new Date() },
    $or: [
      { expiryDate: null },
      { expiryDate: { $gt: new Date() } }
    ]
  })
  .sort({ publishDate: -1 })
  .limit(limit)
  .skip(skip)
  .populate('author', 'firstName lastName profileImage');
};

// Static method to find featured news
newsSchema.statics.findFeatured = function(limit = 5) {
  return this.find({
    status: 'published',
    isFeatured: true,
    publishDate: { $lte: new Date() }
  })
  .sort({ publishDate: -1 })
  .limit(limit)
  .populate('author', 'firstName lastName profileImage');
};

// Static method to search news
newsSchema.statics.search = function(query, limit = 10) {
  return this.find({
    status: 'published',
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  })
  .sort({ publishDate: -1 })
  .limit(limit)
  .populate('author', 'firstName lastName profileImage');
};

// Indexes for better performance
// Note: slug already has a unique index from schema definition
newsSchema.index({ status: 1, publishDate: -1 });
newsSchema.index({ category: 1 });
newsSchema.index({ isFeatured: 1 });
newsSchema.index({ isBreaking: 1 });
newsSchema.index({ language: 1 });
newsSchema.index({ author: 1 });
newsSchema.index({ title: 'text', content: 'text', tags: 'text' });
newsSchema.index({ views: -1 });
newsSchema.index({ likes: -1 });

module.exports = mongoose.model('News', newsSchema);
