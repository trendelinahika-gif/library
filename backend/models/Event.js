const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  location: {
    name: {
      type: String,
      required: [true, 'Location name is required'],
      trim: true,
      maxlength: [100, 'Location name cannot exceed 100 characters']
    },
    address: {
      type: String,
      required: [true, 'Location address is required'],
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    room: {
      type: String,
      trim: true,
      maxlength: [50, 'Room name cannot exceed 50 characters']
    },
    floor: Number,
    capacity: Number
  },
  category: {
    type: String,
    enum: [
      'Workshop', 'Lecture', 'Exhibition', 'Book Launch', 'Reading', 
      'Conference', 'Seminar', 'Training', 'Cultural Event', 'Educational',
      'Children Event', 'Author Talk', 'Book Club', 'Film Screening',
      'Music Event', 'Art Exhibition', 'Poetry Reading', 'Other'
    ],
    required: [true, 'Event category is required']
  },
  organizer: {
    name: {
      type: String,
      required: [true, 'Organizer name is required'],
      trim: true,
      maxlength: [100, 'Organizer name cannot exceed 100 characters']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    }
  },
  image: {
    type: String,
    default: null
  },
  images: [{
    url: String,
    caption: String,
    alt: String
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  isFree: {
    type: Boolean,
    default: true
  },
  price: {
    type: Number,
    min: 0,
    default: 0
  },
  currency: {
    type: String,
    default: 'EUR',
    enum: ['EUR', 'USD', 'ALL']
  },
  maxAttendees: {
    type: Number,
    min: 1,
    default: null
  },
  currentAttendees: {
    type: Number,
    default: 0,
    min: 0
  },
  registrationRequired: {
    type: Boolean,
    default: false
  },
  registrationDeadline: {
    type: Date,
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: null
  },
  recurringEndDate: {
    type: Date,
    default: null
  },
  requirements: {
    type: String,
    maxlength: [500, 'Requirements cannot exceed 500 characters']
  },
  contactInfo: {
    email: String,
    phone: String,
    website: String
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered'
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full date and time
eventSchema.virtual('fullDateTime').get(function() {
  const start = new Date(this.eventDate);
  const [hours, minutes] = this.startTime.split(':');
  start.setHours(parseInt(hours), parseInt(minutes));
  return start;
});

// Virtual for is upcoming
eventSchema.virtual('isUpcoming').get(function() {
  return this.fullDateTime > new Date() && this.status === 'published';
});

// Virtual for is past
eventSchema.virtual('isPast').get(function() {
  return this.fullDateTime < new Date();
});

// Virtual for can register
eventSchema.virtual('canRegister').get(function() {
  if (!this.registrationRequired) return false;
  if (this.status !== 'published') return false;
  if (this.registrationDeadline && new Date() > this.registrationDeadline) return false;
  if (this.maxAttendees && this.currentAttendees >= this.maxAttendees) return false;
  return this.isUpcoming;
});

// Virtual for spots remaining
eventSchema.virtual('spotsRemaining').get(function() {
  if (!this.maxAttendees) return null;
  return Math.max(0, this.maxAttendees - this.currentAttendees);
});

// Pre-save middleware to update current attendees count
eventSchema.pre('save', function(next) {
  this.currentAttendees = this.attendees.filter(a => a.status === 'registered').length;
  next();
});

// Static method to find upcoming events
eventSchema.statics.findUpcoming = function(limit = 10) {
  return this.find({
    status: 'published',
    eventDate: { $gte: new Date() }
  }).sort({ eventDate: 1 }).limit(limit);
};

// Static method to find events by category
eventSchema.statics.findByCategory = function(category, limit = 10) {
  return this.find({
    category: category,
    status: 'published'
  }).sort({ eventDate: 1 }).limit(limit);
};

// Indexes for better performance
eventSchema.index({ eventDate: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ isFeatured: 1 });
eventSchema.index({ isPublic: 1 });
eventSchema.index({ 'location.name': 'text', title: 'text', description: 'text' });
eventSchema.index({ createdBy: 1 });
eventSchema.index({ eventDate: 1, status: 1 });

module.exports = mongoose.model('Event', eventSchema);
