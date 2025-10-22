import mongoose, { Schema } from 'mongoose';
import { IMatch } from '../types';

const MatchSchema = new Schema<IMatch>({
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: String,
    maxlength: 1000
  },
  lastMessageAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure users array has exactly 2 elements
MatchSchema.pre('save', function(next) {
  if (this.users.length !== 2) {
    return next(new Error('Match must have exactly 2 users'));
  }
  next();
});

// Indexes for better query performance
MatchSchema.index({ users: 1 });
MatchSchema.index({ isActive: 1, lastMessageAt: -1 });
MatchSchema.index({ createdAt: -1 });

// Static method to find match between two users
MatchSchema.statics.findMatchBetweenUsers = async function(userId1: string, userId2: string) {
  return this.findOne({
    users: { $all: [userId1, userId2] },
    isActive: true
  }).populate('users', 'name photos');
};

// Static method to get user's matches
MatchSchema.statics.getUserMatches = async function(userId: string, page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;
  
  const matches = await this.find({
    users: userId,
    isActive: true
  })
  .sort({ lastMessageAt: -1, createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .populate('users', 'name photos lastActive');

  const total = await this.countDocuments({
    users: userId,
    isActive: true
  });

  return {
    matches,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
};

// Instance method to update last message
MatchSchema.methods.updateLastMessage = async function(message: string): Promise<void> {
  this.lastMessage = message;
  this.lastMessageAt = new Date();
  await this.save();
};

export default mongoose.model<IMatch>('Match', MatchSchema);