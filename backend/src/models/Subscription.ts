import mongoose, { Schema } from 'mongoose';
import { ISubscription } from '../types';

const SubscriptionSchema = new Schema<ISubscription>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  stripeCustomerId: {
    type: String,
    required: true,
    unique: true
  },
  stripeSubscriptionId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'past_due', 'incomplete'],
    required: true,
    default: 'incomplete'
  },
  currentPeriodStart: {
    type: Date,
    required: true
  },
  currentPeriodEnd: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ currentPeriodEnd: 1 });
SubscriptionSchema.index({ stripeCustomerId: 1 });
SubscriptionSchema.index({ stripeSubscriptionId: 1 });

// Static method to find active subscription by user ID
SubscriptionSchema.statics.findActiveSubscription = async function(userId: string) {
  return this.findOne({
    userId,
    status: 'active',
    currentPeriodEnd: { $gt: new Date() }
  });
};

// Static method to find subscription by Stripe subscription ID
SubscriptionSchema.statics.findByStripeSubscriptionId = async function(stripeSubscriptionId: string) {
  return this.findOne({ stripeSubscriptionId });
};

// Static method to update subscription status
SubscriptionSchema.statics.updateSubscriptionStatus = async function(
  stripeSubscriptionId: string,
  status: 'active' | 'canceled' | 'past_due' | 'incomplete',
  currentPeriodStart?: Date,
  currentPeriodEnd?: Date
) {
  const updateData: any = { status };
  
  if (currentPeriodStart) updateData.currentPeriodStart = currentPeriodStart;
  if (currentPeriodEnd) updateData.currentPeriodEnd = currentPeriodEnd;

  return this.findOneAndUpdate(
    { stripeSubscriptionId },
    updateData,
    { new: true }
  );
};

// Instance method to check if subscription is active
SubscriptionSchema.methods.isActive = function(): boolean {
  return this.status === 'active' && new Date() < this.currentPeriodEnd;
};

// Instance method to get days until expiration
SubscriptionSchema.methods.getDaysUntilExpiration = function(): number {
  const now = new Date();
  const expiration = new Date(this.currentPeriodEnd);
  const diffTime = expiration.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Static method to get subscription analytics
SubscriptionSchema.statics.getSubscriptionAnalytics = async function() {
  const analytics = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const totalSubscriptions = await this.countDocuments();
  const activeSubscriptions = await this.countDocuments({
    status: 'active',
    currentPeriodEnd: { $gt: new Date() }
  });

  const result = {
    total: totalSubscriptions,
    active: activeSubscriptions,
    byStatus: {} as Record<string, number>
  };

  analytics.forEach(item => {
    result.byStatus[item._id] = item.count;
  });

  return result;
};

// Static method to find expiring subscriptions
SubscriptionSchema.statics.findExpiringSubscriptions = async function(daysAhead: number = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return this.find({
    status: 'active',
    currentPeriodEnd: {
      $gte: new Date(),
      $lte: futureDate
    }
  }).populate('userId', 'name email');
};

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);