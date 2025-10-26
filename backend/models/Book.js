const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    maxlength: [100, 'Author name cannot exceed 100 characters']
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    match: [/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/, 'Please enter a valid ISBN']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  genre: [{
    type: String,
    enum: [
      'Fiction', 'Non-Fiction', 'Biography', 'History', 'Science', 
      'Technology', 'Art', 'Literature', 'Poetry', 'Drama', 'Philosophy',
      'Religion', 'Education', 'Reference', 'Children', 'Young Adult',
      'Mystery', 'Romance', 'Fantasy', 'Science Fiction', 'Horror',
      'Thriller', 'Adventure', 'Comedy', 'Tragedy', 'Documentary'
    ]
  }],
  language: {
    type: String,
    enum: ['Albanian', 'Serbian', 'English', 'French', 'German', 'Italian', 'Turkish', 'Other'],
    default: 'Albanian'
  },
  publicationYear: {
    type: Number,
    min: [1000, 'Publication year must be valid'],
    max: [new Date().getFullYear(), 'Publication year cannot be in the future']
  },
  publisher: {
    type: String,
    trim: true,
    maxlength: [100, 'Publisher name cannot exceed 100 characters']
  },
  pages: {
    type: Number,
    min: [1, 'Book must have at least 1 page']
  },
  coverImage: {
    type: String,
    default: null
  },
  totalCopies: {
    type: Number,
    required: [true, 'Total copies is required'],
    min: [1, 'Must have at least 1 copy'],
    default: 1
  },
  availableCopies: {
    type: Number,
    required: [true, 'Available copies is required'],
    min: [0, 'Available copies cannot be negative'],
    default: function() { return this.totalCopies; }
  },
  status: {
    type: String,
    enum: ['available', 'unavailable', 'maintenance', 'lost'],
    default: 'available'
  },
  location: {
    section: {
      type: String,
      trim: true,
      maxlength: [50, 'Section name cannot exceed 50 characters']
    },
    shelf: {
      type: String,
      trim: true,
      maxlength: [20, 'Shelf identifier cannot exceed 20 characters']
    },
    floor: {
      type: Number,
      min: [0, 'Floor must be non-negative']
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  isDigital: {
    type: Boolean,
    default: false
  },
  digitalFile: {
    url: String,
    format: {
      type: String,
      enum: ['PDF', 'EPUB', 'MOBI', 'TXT', 'DOC', 'DOCX']
    },
    size: Number, // in bytes
    pages: Number
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  borrowCount: {
    type: Number,
    default: 0,
    min: 0
  },
  lastBorrowed: {
    type: Date,
    default: null
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for availability status
bookSchema.virtual('isAvailable').get(function() {
  return this.availableCopies > 0 && this.status === 'available';
});

// Virtual for full location
bookSchema.virtual('fullLocation').get(function() {
  if (!this.location.section) return 'Not specified';
  return `${this.location.section}${this.location.shelf ? ` - Shelf ${this.location.shelf}` : ''}${this.location.floor ? ` (Floor ${this.location.floor})` : ''}`;
});

// Pre-save middleware to update available copies
bookSchema.pre('save', function(next) {
  if (this.isModified('totalCopies')) {
    this.availableCopies = this.totalCopies;
  }
  next();
});

// Indexes for better performance
bookSchema.index({ title: 'text', author: 'text', description: 'text' });
// Note: isbn already has a unique index from schema definition
bookSchema.index({ genre: 1 });
bookSchema.index({ language: 1 });
bookSchema.index({ status: 1 });
bookSchema.index({ isFeatured: 1 });
bookSchema.index({ isNewArrival: 1 });
bookSchema.index({ isBestseller: 1 });
bookSchema.index({ 'rating.average': -1 });
bookSchema.index({ borrowCount: -1 });
bookSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Book', bookSchema);
