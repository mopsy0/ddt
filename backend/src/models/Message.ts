import mongoose, { Schema } from 'mongoose';
import { IMessage } from '../types';

const MessageSchema = new Schema<IMessage>({
  matchId: {
    type: Schema.Types.ObjectId,
    ref: 'Match',
    required: true,
    index: true
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'gif'],
    default: 'text'
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
MessageSchema.index({ matchId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1, createdAt: -1 });
MessageSchema.index({ isRead: 1 });

// Static method to get messages for a match
MessageSchema.statics.getMatchMessages = async function(
  matchId: string, 
  page: number = 1, 
  limit: number = 50
) {
  const skip = (page - 1) * limit;
  
  const messages = await this.find({ matchId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('senderId', 'name photos');

  const total = await this.countDocuments({ matchId });

  return {
    messages: messages.reverse(), // Reverse to show oldest first
    total,
    page,
    pages: Math.ceil(total / limit)
  };
};

// Static method to mark messages as read
MessageSchema.statics.markMessagesAsRead = async function(matchId: string, userId: string) {
  return this.updateMany(
    {
      matchId,
      senderId: { $ne: userId },
      isRead: false
    },
    { isRead: true }
  );
};

// Static method to get unread message count
MessageSchema.statics.getUnreadCount = async function(userId: string) {
  // First, get all matches for the user
  const Match = mongoose.model('Match');
  const userMatches = await Match.find({ users: userId }).select('_id');
  const matchIds = userMatches.map(match => match._id);

  return this.countDocuments({
    matchId: { $in: matchIds },
    senderId: { $ne: userId },
    isRead: false
  });
};

// Static method to get recent messages for each match
MessageSchema.statics.getRecentMessagesForMatches = async function(matchIds: string[]) {
  const pipeline = [
    { $match: { matchId: { $in: matchIds.map(id => new mongoose.Types.ObjectId(id)) } } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$matchId',
        lastMessage: { $first: '$$ROOT' }
      }
    }
  ];

  const results = await this.aggregate(pipeline);
  
  // Convert to a map for easy lookup
  const messageMap = new Map();
  results.forEach(result => {
    messageMap.set(result._id.toString(), result.lastMessage);
  });

  return messageMap;
};

export default mongoose.model<IMessage>('Message', MessageSchema);