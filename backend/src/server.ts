import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import rateLimit from 'express-rate-limit';

// Import database connection
import { connectDatabase } from './config/database';

// Import routes
import authRoutes from './routes/auth';
// Import other routes (to be created)
// import userRoutes from './routes/users';
// import swipeRoutes from './routes/swipes';
// import matchRoutes from './routes/matches';
// import messageRoutes from './routes/messages';
// import subscriptionRoutes from './routes/subscriptions';

// Import middleware
import { handleUploadError } from './middleware/upload';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);

// Socket.IO setup for real-time chat
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-production-domain.com'] 
      : ['http://localhost:3000', 'http://localhost:19006'], // React Native development
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Global rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
    },
  },
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-production-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:19006'],
  credentials: true
}));

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Wonder Dating API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/swipes', swipeRoutes);
// app.use('/api/matches', matchRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/subscriptions', subscriptionRoutes);

// Upload error handling middleware
app.use(handleUploadError);

// Socket.IO connection handling for real-time chat
const connectedUsers = new Map<string, string>(); // userId -> socketId

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // User joins with their ID
  socket.on('join', (userId: string) => {
    connectedUsers.set(userId, socket.id);
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  // Join a match room for messaging
  socket.on('join_match', (matchId: string) => {
    socket.join(`match_${matchId}`);
    console.log(`Socket ${socket.id} joined match ${matchId}`);
  });

  // Handle new messages
  socket.on('send_message', (data: {
    matchId: string;
    senderId: string;
    content: string;
    messageType: 'text' | 'image' | 'gif';
  }) => {
    // Broadcast message to match room
    socket.to(`match_${data.matchId}`).emit('new_message', {
      matchId: data.matchId,
      senderId: data.senderId,
      content: data.content,
      messageType: data.messageType,
      timestamp: new Date().toISOString()
    });
  });

  // Handle typing indicators
  socket.on('typing_start', (data: { matchId: string; userId: string }) => {
    socket.to(`match_${data.matchId}`).emit('user_typing', {
      userId: data.userId,
      isTyping: true
    });
  });

  socket.on('typing_stop', (data: { matchId: string; userId: string }) => {
    socket.to(`match_${data.matchId}`).emit('user_typing', {
      userId: data.userId,
      isTyping: false
    });
  });

  // Handle message read receipts
  socket.on('mark_read', (data: { matchId: string; userId: string }) => {
    socket.to(`match_${data.matchId}`).emit('messages_read', {
      userId: data.userId,
      matchId: data.matchId
    });
  });

  // Handle user online status
  socket.on('user_online', (userId: string) => {
    socket.broadcast.emit('user_status_change', {
      userId,
      isOnline: true,
      lastSeen: new Date().toISOString()
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    
    // Find and remove user from connected users
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        socket.broadcast.emit('user_status_change', {
          userId,
          isOnline: false,
          lastSeen: new Date().toISOString()
        });
        break;
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    
    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Wonder Dating API server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`💬 Socket.IO enabled for real-time chat`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

startServer();

export { app, io };