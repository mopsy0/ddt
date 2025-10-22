import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { generateToken, authenticateToken } from '../middleware/auth';
import { APIResponse, AuthRequest } from '../types';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  }
});

/**
 * @route POST /api/auth/signup
 * @desc Register a new user with email and password
 * @access Public
 */
router.post('/signup', authLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('age').isInt({ min: 18, max: 100 }).withMessage('Age must be between 18 and 100'),
  body('occupation').trim().isLength({ min: 2, max: 100 }).withMessage('Occupation is required'),
  body('preferences.interestedIn').isIn(['men', 'women', 'both']).withMessage('Invalid preference'),
  body('preferences.ageRange.min').isInt({ min: 18, max: 100 }).withMessage('Invalid age range'),
  body('preferences.ageRange.max').isInt({ min: 18, max: 100 }).withMessage('Invalid age range'),
  body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Location coordinates required')
], async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const response: APIResponse = {
        success: false,
        message: 'Validation failed',
        error: errors.array()[0].msg
      };
      return res.status(400).json(response);
    }

    const {
      email,
      password,
      name,
      age,
      occupation,
      bio = '',
      preferences,
      location
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const response: APIResponse = {
        success: false,
        message: 'User with this email already exists'
      };
      return res.status(409).json(response);
    }

    // Validate age range
    if (preferences.ageRange.min > preferences.ageRange.max) {
      const response: APIResponse = {
        success: false,
        message: 'Invalid age range: minimum age cannot be greater than maximum age'
      };
      return res.status(400).json(response);
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      age,
      occupation,
      bio,
      preferences: {
        ageRange: preferences.ageRange,
        maxDistance: preferences.maxDistance || 25,
        interestedIn: preferences.interestedIn
      },
      location: {
        type: 'Point',
        coordinates: location.coordinates
      },
      photos: [], // Photos will be added separately
      swipes: { liked: [], passed: [] },
      matches: []
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    const response: APIResponse = {
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          age: user.age,
          occupation: user.occupation,
          bio: user.bio,
          photos: user.photos,
          preferences: user.preferences,
          isPremium: user.isPremium,
          createdAt: user.createdAt
        },
        token
      }
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error('Signup error:', error);
    const response: APIResponse = {
      success: false,
      message: 'Registration failed',
      error: error.message
    };
    res.status(500).json(response);
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login user with email and password
 * @access Public
 */
router.post('/login', authLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const response: APIResponse = {
        success: false,
        message: 'Validation failed',
        error: errors.array()[0].msg
      };
      return res.status(400).json(response);
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const response: APIResponse = {
        success: false,
        message: 'Invalid credentials'
      };
      return res.status(401).json(response);
    }

    // Check if account is active
    if (!user.isActive) {
      const response: APIResponse = {
        success: false,
        message: 'Account is deactivated'
      };
      return res.status(401).json(response);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const response: APIResponse = {
        success: false,
        message: 'Invalid credentials'
      };
      return res.status(401).json(response);
    }

    // Update last active
    await user.updateLastActive();

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    const response: APIResponse = {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          age: user.age,
          occupation: user.occupation,
          bio: user.bio,
          photos: user.photos,
          preferences: user.preferences,
          isPremium: user.isPremium,
          lastActive: user.lastActive
        },
        token
      }
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Login error:', error);
    const response: APIResponse = {
      success: false,
      message: 'Login failed',
      error: error.message
    };
    res.status(500).json(response);
  }
});

/**
 * @route POST /api/auth/apple
 * @desc Apple Sign In authentication
 * @access Public
 */
router.post('/apple', authLimiter, [
  body('appleId').notEmpty().withMessage('Apple ID is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('name').optional().trim().isLength({ min: 2, max: 100 })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const response: APIResponse = {
        success: false,
        message: 'Validation failed',
        error: errors.array()[0].msg
      };
      return res.status(400).json(response);
    }

    const { appleId, email, name } = req.body;

    // Check if user exists with Apple ID
    let user = await User.findOne({ appleId });
    
    if (!user) {
      // Check if user exists with email
      user = await User.findOne({ email });
      
      if (user) {
        // Link Apple ID to existing account
        user.appleId = appleId;
        await user.save();
      } else {
        // Create new user with Apple Sign In
        // Note: For Apple Sign In, we need additional profile setup
        const response: APIResponse = {
          success: false,
          message: 'Profile setup required',
          data: {
            needsProfileSetup: true,
            appleId,
            email,
            name
          }
        };
        return res.status(202).json(response);
      }
    }

    // Check if account is active
    if (!user.isActive) {
      const response: APIResponse = {
        success: false,
        message: 'Account is deactivated'
      };
      return res.status(401).json(response);
    }

    // Update last active
    await user.updateLastActive();

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    const response: APIResponse = {
      success: true,
      message: 'Apple Sign In successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          age: user.age,
          occupation: user.occupation,
          bio: user.bio,
          photos: user.photos,
          preferences: user.preferences,
          isPremium: user.isPremium,
          lastActive: user.lastActive
        },
        token
      }
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Apple Sign In error:', error);
    const response: APIResponse = {
      success: false,
      message: 'Apple Sign In failed',
      error: error.message
    };
    res.status(500).json(response);
  }
});

/**
 * @route POST /api/auth/apple/complete
 * @desc Complete Apple Sign In profile setup
 * @access Public
 */
router.post('/apple/complete', authLimiter, [
  body('appleId').notEmpty().withMessage('Apple ID is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name is required'),
  body('age').isInt({ min: 18, max: 100 }).withMessage('Age must be between 18 and 100'),
  body('occupation').trim().isLength({ min: 2, max: 100 }).withMessage('Occupation is required'),
  body('preferences.interestedIn').isIn(['men', 'women', 'both']).withMessage('Invalid preference'),
  body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Location coordinates required')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const response: APIResponse = {
        success: false,
        message: 'Validation failed',
        error: errors.array()[0].msg
      };
      return res.status(400).json(response);
    }

    const {
      appleId,
      email,
      name,
      age,
      occupation,
      bio = '',
      preferences,
      location
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { appleId }] 
    });
    
    if (existingUser) {
      const response: APIResponse = {
        success: false,
        message: 'User already exists'
      };
      return res.status(409).json(response);
    }

    // Create new user with Apple Sign In
    const user = new User({
      email,
      appleId,
      name,
      age,
      occupation,
      bio,
      preferences: {
        ageRange: preferences.ageRange,
        maxDistance: preferences.maxDistance || 25,
        interestedIn: preferences.interestedIn
      },
      location: {
        type: 'Point',
        coordinates: location.coordinates
      },
      photos: [],
      swipes: { liked: [], passed: [] },
      matches: []
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    const response: APIResponse = {
      success: true,
      message: 'Apple Sign In profile completed successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          age: user.age,
          occupation: user.occupation,
          bio: user.bio,
          photos: user.photos,
          preferences: user.preferences,
          isPremium: user.isPremium,
          createdAt: user.createdAt
        },
        token
      }
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error('Apple Sign In completion error:', error);
    const response: APIResponse = {
      success: false,
      message: 'Profile completion failed',
      error: error.message
    };
    res.status(500).json(response);
  }
});

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;

    const response: APIResponse = {
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          age: user.age,
          occupation: user.occupation,
          bio: user.bio,
          photos: user.photos,
          preferences: user.preferences,
          isPremium: user.isPremium,
          lastActive: user.lastActive,
          createdAt: user.createdAt
        }
      }
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Get profile error:', error);
    const response: APIResponse = {
      success: false,
      message: 'Failed to retrieve user profile',
      error: error.message
    };
    res.status(500).json(response);
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Logout user (client-side token removal)
 * @access Private
 */
router.post('/logout', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    // Update last active time
    await req.user!.updateLastActive();

    const response: APIResponse = {
      success: true,
      message: 'Logged out successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Logout error:', error);
    const response: APIResponse = {
      success: false,
      message: 'Logout failed',
      error: error.message
    };
    res.status(500).json(response);
  }
});

export default router;