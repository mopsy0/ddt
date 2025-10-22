import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest, APIResponse } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      const response: APIResponse = {
        success: false,
        message: 'Access token required'
      };
      res.status(401).json(response);
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      const response: APIResponse = {
        success: false,
        message: 'Invalid token or user not found'
      };
      res.status(401).json(response);
      return;
    }

    // Update last active
    await user.updateLastActive();

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    const response: APIResponse = {
      success: false,
      message: 'Invalid or expired token'
    };
    res.status(401).json(response);
  }
};

/**
 * Middleware to check if user has premium subscription
 */
export const requirePremium = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    const response: APIResponse = {
      success: false,
      message: 'Authentication required'
    };
    res.status(401).json(response);
    return;
  }

  if (!req.user.isPremiumActive()) {
    const response: APIResponse = {
      success: false,
      message: 'Premium subscription required'
    };
    res.status(403).json(response);
    return;
  }

  next();
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
      const user = await User.findById(decoded.userId);
      
      if (user && user.isActive) {
        req.user = user;
        await user.updateLastActive();
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

/**
 * Generate JWT token for user
 */
export const generateToken = (userId: string, email: string): string => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn }
  );
};

/**
 * Verify JWT token without middleware
 */
export const verifyToken = (token: string): { userId: string; email: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch (error) {
    return null;
  }
};