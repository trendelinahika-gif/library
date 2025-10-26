const mongoose = require('mongoose');

const borrowingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book ID is required']
  },
  borrowDate: {
    type: Date,
    required: [true, 'Borrow date is required'],
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  returnDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'returned', 'overdue', 'lost'],
    default: 'active'
  },
  fineAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  finePaid: {
    type: Boolean,
    default: false
  },
  finePaidDate: {
    type: Date,
    default: null
  },
  renewalCount: {
    type: Number,
    default: 0,
    min: 0,
    max: 3 // Maximum 3 renewals
  },
  lastRenewalDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  returnedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for days overdue
borrowingSchema.virtual('daysOverdue').get(function() {
  if (this.status === 'returned' || this.status === 'lost') return 0;
  const now = new Date();
  const due = new Date(this.dueDate);
  return Math.max(0, Math.ceil((now - due) / (1000 * 60 * 60 * 24)));
});

// Virtual for can renew
borrowingSchema.virtual('canRenew').get(function() {
  return this.status === 'active' && 
         this.renewalCount < 3 && 
         this.daysOverdue <= 7; // Can renew if not more than 7 days overdue
});

// Virtual for is overdue
borrowingSchema.virtual('isOverdue').get(function() {
  return this.status === 'active' && this.daysOverdue > 0;
});

// Pre-save middleware to calculate fine
borrowingSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'returned') {
    this.returnDate = new Date();
  }
  
  if (this.isModified('status') && this.status === 'overdue') {
    // Calculate fine: $0.50 per day overdue
    const fineRate = 0.50;
    this.fineAmount = this.daysOverdue * fineRate;
  }
  
  next();
});

// Static method to find overdue borrowings
borrowingSchema.statics.findOverdue = function() {
  const today = new Date();
  return this.find({
    status: 'active',
    dueDate: { $lt: today }
  });
};

// Static method to calculate user's total fines
borrowingSchema.statics.calculateUserFines = async function(userId) {
  const result = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, totalFines: { $sum: '$fineAmount' } } }
  ]);
  return result.length > 0 ? result[0].totalFines : 0;
};

// Indexes for better performance
borrowingSchema.index({ userId: 1 });
borrowingSchema.index({ bookId: 1 });
borrowingSchema.index({ status: 1 });
borrowingSchema.index({ dueDate: 1 });
borrowingSchema.index({ borrowDate: -1 });
borrowingSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Borrowing', borrowingSchema);
