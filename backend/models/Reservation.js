const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
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
  reservationDate: {
    type: Date,
    required: [true, 'Reservation date is required'],
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'fulfilled', 'cancelled', 'expired'],
    default: 'pending'
  },
  priority: {
    type: Number,
    default: 0,
    min: 0
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  notificationSent: {
    type: Boolean,
    default: false
  },
  fulfilledDate: {
    type: Date,
    default: null
  },
  cancelledDate: {
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for days until expiry
reservationSchema.virtual('daysUntilExpiry').get(function() {
  if (this.status !== 'pending') return null;
  const now = new Date();
  const expiry = new Date(this.expiryDate);
  return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
});

// Virtual for is expired
reservationSchema.virtual('isExpired').get(function() {
  if (this.status !== 'pending') return false;
  const now = new Date();
  return now > this.expiryDate;
});

// Pre-save middleware to set expiry date (7 days from reservation)
reservationSchema.pre('save', function(next) {
  if (this.isNew) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now
    this.expiryDate = expiryDate;
  }
  next();
});

// Pre-save middleware to update status based on expiry
reservationSchema.pre('save', function(next) {
  if (this.isExpired && this.status === 'pending') {
    this.status = 'expired';
  }
  next();
});

// Static method to find expired reservations
reservationSchema.statics.findExpired = function() {
  const now = new Date();
  return this.find({
    status: 'pending',
    expiryDate: { $lt: now }
  });
};

// Static method to get user's position in queue
reservationSchema.statics.getUserPosition = async function(userId, bookId) {
  const reservations = await this.find({
    bookId: bookId,
    status: 'pending'
  }).sort({ reservationDate: 1 });
  
  const userIndex = reservations.findIndex(r => r.userId.toString() === userId.toString());
  return userIndex >= 0 ? userIndex + 1 : null;
};

// Static method to update priorities for a book
reservationSchema.statics.updatePriorities = async function(bookId) {
  const reservations = await this.find({
    bookId: bookId,
    status: 'pending'
  }).sort({ reservationDate: 1 });
  
  for (let i = 0; i < reservations.length; i++) {
    reservations[i].priority = i + 1;
    await reservations[i].save();
  }
};

// Indexes for better performance
reservationSchema.index({ userId: 1 });
reservationSchema.index({ bookId: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ reservationDate: 1 });
reservationSchema.index({ expiryDate: 1 });
reservationSchema.index({ bookId: 1, status: 1, priority: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
