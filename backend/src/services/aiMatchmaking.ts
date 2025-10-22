import OpenAI from 'openai';
import User from '../models/User';
import Swipe from '../models/Swipe';
import { IUser, MatchmakingCriteria } from '../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * AI-powered matchmaking service
 */
export class AIMatchmakingService {
  /**
   * Generate AI-powered user recommendations based on preferences and behavior
   */
  static async generateRecommendations(criteria: MatchmakingCriteria): Promise<IUser[]> {
    try {
      const { userId, location, preferences, excludeIds, limit } = criteria;

      // Get user's swipe history for behavioral analysis
      const userSwipeHistory = await Swipe.getUserSwipeHistory(userId, undefined, 1, 100);
      const likedUsers = userSwipeHistory.swipes
        .filter(swipe => swipe.action === 'like')
        .map(swipe => swipe.swipedUserId);

      // Get potential matches based on location and basic preferences
      const potentialMatches = await User.findPotentialMatches(
        userId,
        location,
        preferences,
        excludeIds,
        limit * 3 // Get more candidates for AI filtering
      );

      if (potentialMatches.length === 0) {
        return [];
      }

      // If user has liked users before, use AI to find similar patterns
      if (likedUsers.length > 0) {
        const aiFilteredMatches = await this.filterMatchesWithAI(
          userId,
          potentialMatches,
          likedUsers,
          limit
        );
        return aiFilteredMatches;
      }

      // For new users, return matches based on preferences only
      return potentialMatches.slice(0, limit);
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      // Fallback to basic matching
      return User.findPotentialMatches(
        criteria.userId,
        criteria.location,
        criteria.preferences,
        criteria.excludeIds,
        criteria.limit
      );
    }
  }

  /**
   * Use AI to filter and rank potential matches based on user preferences
   */
  private static async filterMatchesWithAI(
    userId: string,
    potentialMatches: IUser[],
    likedUsers: any[],
    limit: number
  ): Promise<IUser[]> {
    try {
      // Prepare data for AI analysis
      const likedProfiles = likedUsers.map(user => ({
        age: user.age,
        occupation: user.occupation,
        bio: user.bio?.substring(0, 200), // Limit bio length for API
      }));

      const candidateProfiles = potentialMatches.map(user => ({
        id: user._id.toString(),
        age: user.age,
        occupation: user.occupation,
        bio: user.bio?.substring(0, 200),
      }));

      const prompt = `
        Based on the user's liked profiles, rank the candidate profiles by compatibility.
        
        Liked profiles:
        ${JSON.stringify(likedProfiles, null, 2)}
        
        Candidate profiles:
        ${JSON.stringify(candidateProfiles, null, 2)}
        
        Please analyze patterns in the liked profiles (age preferences, occupation types, bio themes, interests) 
        and rank the candidate profiles by how well they match these patterns. 
        
        Return only a JSON array of user IDs in order of compatibility (most compatible first), 
        limited to ${limit} profiles:
        ["userId1", "userId2", "userId3", ...]
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an AI matchmaking expert. Analyze user preferences and provide compatibility rankings.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Parse AI response
      const rankedIds = JSON.parse(response);
      
      // Return matches in AI-recommended order
      const rankedMatches: IUser[] = [];
      for (const id of rankedIds) {
        const match = potentialMatches.find(user => user._id.toString() === id);
        if (match) {
          rankedMatches.push(match);
        }
      }

      return rankedMatches;
    } catch (error) {
      console.error('Error filtering matches with AI:', error);
      // Fallback to original order
      return potentialMatches.slice(0, limit);
    }
  }

  /**
   * Generate conversation starters for matches using AI
   */
  static async generateConversationStarter(
    user1: IUser,
    user2: IUser
  ): Promise<string> {
    try {
      const prompt = `
        Generate a personalized conversation starter for a dating app match.
        
        User 1: ${user1.name}, ${user1.age}, ${user1.occupation}
        Bio: ${user1.bio}
        
        User 2: ${user2.name}, ${user2.age}, ${user2.occupation}
        Bio: ${user2.bio}
        
        Create a natural, engaging conversation starter that ${user1.name} could send to ${user2.name}.
        The message should be friendly, reference something from ${user2.name}'s profile, and be under 100 characters.
        Don't include quotation marks in the response.
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a dating app conversation expert. Create natural, engaging conversation starters.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      return response || "Hey! I'd love to get to know you better. How's your day going?";
    } catch (error) {
      console.error('Error generating conversation starter:', error);
      return "Hey! I'd love to get to know you better. How's your day going?";
    }
  }

  /**
   * Analyze user compatibility using AI
   */
  static async analyzeCompatibility(user1: IUser, user2: IUser): Promise<{
    score: number;
    reasons: string[];
  }> {
    try {
      const prompt = `
        Analyze compatibility between two dating app users and provide a compatibility score.
        
        User 1: ${user1.name}, ${user1.age}, ${user1.occupation}
        Bio: ${user1.bio}
        
        User 2: ${user2.name}, ${user2.age}, ${user2.occupation}
        Bio: ${user2.bio}
        
        Provide a compatibility analysis in the following JSON format:
        {
          "score": 85,
          "reasons": ["Shared interest in travel", "Similar age range", "Complementary personalities"]
        }
        
        Score should be 0-100. Reasons should be specific and based on their profiles.
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a relationship compatibility expert. Analyze profiles and provide detailed compatibility insights.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.5,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      const analysis = JSON.parse(response);
      return {
        score: Math.max(0, Math.min(100, analysis.score)),
        reasons: Array.isArray(analysis.reasons) ? analysis.reasons : [],
      };
    } catch (error) {
      console.error('Error analyzing compatibility:', error);
      return {
        score: 50,
        reasons: ['Compatible age range', 'Shared interests'],
      };
    }
  }

  /**
   * Generate profile improvement suggestions using AI
   */
  static async generateProfileSuggestions(user: IUser): Promise<string[]> {
    try {
      const prompt = `
        Analyze this dating app profile and provide 3-5 specific suggestions to make it more attractive.
        
        Name: ${user.name}
        Age: ${user.age}
        Occupation: ${user.occupation}
        Bio: ${user.bio}
        Number of photos: ${user.photos.length}
        
        Provide suggestions as a JSON array of strings:
        ["suggestion 1", "suggestion 2", "suggestion 3"]
        
        Focus on bio improvements, photo suggestions, and overall profile optimization.
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a dating profile optimization expert. Provide helpful, specific advice to improve dating profiles.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 400,
        temperature: 0.6,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      const suggestions = JSON.parse(response);
      return Array.isArray(suggestions) ? suggestions : [];
    } catch (error) {
      console.error('Error generating profile suggestions:', error);
      return [
        'Add more photos showing your hobbies and interests',
        'Make your bio more specific about what you enjoy doing',
        'Include a photo with friends to show your social side',
      ];
    }
  }
}