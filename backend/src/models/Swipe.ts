import mongoose, { Schema } from 'mongoose';
import { ISwipe } from '../types';

const SwipeSchema = new Schema<ISwipe>({
  swiperId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  swipedUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    enum: ['like', 'pass', 'superlike'],
    required: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate swipes
SwipeSchema.index({ swiperId: 1, swipedUserId: 1 }, { unique: true });

// Index for analytics and matching
SwipeSchema.index({ action: 1, createdAt: -1 });

// Static method to check if user has already swiped on target
SwipeSchema.statics.hasUserSwiped = async function(swiperId: string, swipedUserId: string) {
  const swipe = await this.findOne({ swiperId, swipedUserId });
  return swipe ? swipe.action : null;
};

// Static method to get user's swipe history
SwipeSchema.statics.getUserSwipeHistory = async function(
  userId: string, 
  action?: 'like' | 'pass' | 'superlike',
  page: number = 1,
  limit: number = 50
) {
  const skip = (page - 1) * limit;
  const query: any = { swiperId: userId };
  
  if (action) {
    query.action = action;
  }

  const swipes = await this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('swipedUserId', 'name photos age occupation');

  const total = await this.countDocuments(query);

  return {
    swipes,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
};

// Static method to get swipe analytics for a user
SwipeSchema.statics.getUserSwipeAnalytics = async function(userId: string) {
  const analytics = await this.aggregate([
    { $match: { swiperId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    likes: 0,
    passes: 0,
    superlikes: 0,
    total: 0
  };

  analytics.forEach(item => {
    result[item._id as keyof typeof result] = item.count;
    result.total += item.count;
  });

  return result;
};

// Static method to check for mutual likes (matches)
SwipeSchema.statics.checkForMatch = async function(swiperId: string, swipedUserId: string) {
  // Check if the swiped user has also liked the swiper
  const mutualLike = await this.findOne({
    swiperId: swipedUserId,
    swipedUserId: swiperId,
    action: { $in: ['like', 'superlike'] }
  });

  return !!mutualLike;
};

// Static method to get users who liked this user
SwipeSchema.statics.getUsersWhoLikedMe = async function(
  userId: string,
  page: number = 1,
  limit: number = 20
) {
  const skip = (page - 1) * limit;

  const likes = await this.find({
    swipedUserId: userId,
    action: { $in: ['like', 'superlike'] }
  })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .populate('swiperId', 'name photos age occupation bio');

  const total = await this.countDocuments({
    swipedUserId: userId,
    action: { $in: ['like', 'superlike'] }
  });

  return {
    likes,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
};

export default mongoose.model<ISwipe>('Swipe', SwipeSchema);