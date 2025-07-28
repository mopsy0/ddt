import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    minlength: 6,
    select: false // Don't include password in queries by default
  },
  appleId: {
    type: String,
    unique: true,
    sparse: true // Allow null values but ensure uniqueness when present
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 100
  },
  occupation: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  photos: [{
    type: String,
    required: true
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere' // Enable geospatial queries
    }
  },
  preferences: {
    ageRange: {
      min: {
        type: Number,
        required: true,
        min: 18,
        max: 100
      },
      max: {
        type: Number,
        required: true,
        min: 18,
        max: 100
      }
    },
    maxDistance: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
      default: 25 // km
    },
    interestedIn: {
      type: String,
      enum: ['men', 'women', 'both'],
      required: true
    }
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiresAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  swipes: {
    liked: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    passed: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  matches: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ location: '2dsphere' });
UserSchema.index({ isActive: 1, lastActive: -1 });
UserSchema.index({ isPremium: 1 });
UserSchema.index({ 'preferences.interestedIn': 1 });
UserSchema.index({ age: 1 });

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password') || !this.password) return next();

  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error: any) {
    next(error);
  }
});

// Instance method to check password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if premium is active
UserSchema.methods.isPremiumActive = function(): boolean {
  if (!this.isPremium) return false;
  if (!this.premiumExpiresAt) return true; // Lifetime premium
  return new Date() < this.premiumExpiresAt;
};

// Instance method to update last active
UserSchema.methods.updateLastActive = async function(): Promise<void> {
  this.lastActive = new Date();
  await this.save();
};

// Static method to find potential matches
UserSchema.statics.findPotentialMatches = async function(
  userId: string,
  location: [number, number],
  preferences: IUser['preferences'],
  excludeIds: string[] = [],
  limit: number = 10
) {
  const excludeList = [...excludeIds, userId];

  return this.find({
    _id: { $nin: excludeList },
    isActive: true,
    age: {
      $gte: preferences.ageRange.min,
      $lte: preferences.ageRange.max
    },
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: location
        },
        $maxDistance: preferences.maxDistance * 1000 // Convert km to meters
      }
    },
    'preferences.interestedIn': { $in: ['both', getGenderFromPreference(preferences.interestedIn)] }
  })
  .limit(limit)
  .select('-password -swipes -matches');
};

// Helper function to determine gender preference matching
function getGenderFromPreference(interestedIn: string): string {
  // This is a simplified version - in production, you'd have a gender field
  switch (interestedIn) {
    case 'men': return 'women';
    case 'women': return 'men';
    case 'both': return 'both';
    default: return 'both';
  }
}

// Static method to get user statistics
UserSchema.statics.getUserStats = async function(userId: string) {
  const user = await this.findById(userId);
  if (!user) throw new Error('User not found');

  const totalLikes = user.swipes.liked.length;
  const totalPasses = user.swipes.passed.length;
  const totalMatches = user.matches.length;

  return {
    totalLikes,
    totalPasses,
    totalMatches,
    totalSwipes: totalLikes + totalPasses
  };
};

export default mongoose.model<IUser>('User', UserSchema);