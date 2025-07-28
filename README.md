# Wonder Dating App 💕

A complete, production-ready AI-powered dating app built with React Native (TypeScript) frontend and Node.js + Express backend with MongoDB database.

## Features ✨

### Core Features
- **User Authentication**: Email/password signup/login + Apple Sign In
- **Profile Management**: Name, age, occupation, bio, preferences, and photo uploads
- **Swipe-Style Matching**: Like/pass system with visual feedback
- **Real-time Chat**: Socket.IO powered messaging for matched users
- **AI-Powered Matchmaking**: OpenAI GPT integration for intelligent user recommendations
- **Lookalike Matching**: DeepFace facial recognition for finding similar faces
- **Premium Subscriptions**: Stripe integration for monetization

### AI Features
- Smart matchmaking based on user preferences and behavior patterns
- AI-generated conversation starters
- Compatibility analysis between users
- Profile optimization suggestions
- Facial similarity detection for lookalike matching

### Technical Features
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: React Native + Expo + TypeScript
- **Real-time**: Socket.IO for live chat and notifications
- **Storage**: Cloudinary for image hosting
- **Authentication**: JWT tokens + Apple Sign In
- **Payments**: Stripe for subscription management
- **AI**: OpenAI GPT + DeepFace for facial recognition

## Project Structure 📁

```
wonder-dating-app/
├── backend/                     # Node.js API server
│   ├── src/
│   │   ├── config/             # Database and app configuration
│   │   ├── middleware/         # Authentication, upload, validation
│   │   ├── models/             # MongoDB schemas
│   │   ├── routes/             # API endpoints
│   │   ├── services/           # AI and business logic
│   │   ├── python/             # DeepFace scripts
│   │   ├── types/              # TypeScript interfaces
│   │   └── server.ts           # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── app/                        # React Native frontend
│   ├── components/             # Reusable UI components
│   ├── screens/                # App screens
│   ├── navigation/             # Navigation setup
│   ├── services/               # API calls and utilities
│   ├── store/                  # State management
│   └── types/                  # TypeScript interfaces
├── types/                      # Shared TypeScript types
├── AppEntry.tsx               # Main app entry point
├── package.json               # Frontend dependencies
└── README.md                  # This file
```

## Setup Instructions 🚀

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB (local or MongoDB Atlas)
- Python 3.8+ (for DeepFace)
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (Mac) or Android Studio

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Install Python dependencies:**
   ```bash
   cd src/python
   pip install -r requirements.txt
   cd ../..
   ```

4. **Environment Configuration:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/wonder-dating
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   
   # OpenAI
   OPENAI_API_KEY=sk-your-openai-api-key-here
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   
   # Stripe
   STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
   
   # Apple Sign In
   APPLE_CLIENT_ID=your-apple-client-id
   APPLE_TEAM_ID=your-apple-team-id
   APPLE_KEY_ID=your-apple-key-id
   APPLE_PRIVATE_KEY_PATH=./keys/AuthKey.p8
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..  # If you're in the backend directory
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo development server:**
   ```bash
   npm start
   ```

4. **Run on device/simulator:**
   - iOS: `npm run ios` or scan QR code with Camera app
   - Android: `npm run android` or scan QR code with Expo Go app

## API Endpoints 📡

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/apple` - Apple Sign In
- `POST /api/auth/apple/complete` - Complete Apple Sign In setup
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout user

### Users (To be implemented)
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/photos` - Upload photos
- `DELETE /api/users/photos/:photoId` - Delete photo
- `GET /api/users/recommendations` - Get AI recommendations
- `POST /api/users/lookalike` - Find lookalike users

### Swipes (To be implemented)
- `POST /api/swipes` - Record swipe action
- `GET /api/swipes/history` - Get swipe history
- `GET /api/swipes/analytics` - Get swipe analytics

### Matches (To be implemented)
- `GET /api/matches` - Get user matches
- `GET /api/matches/:id` - Get specific match
- `DELETE /api/matches/:id` - Unmatch user

### Messages (To be implemented)
- `GET /api/messages/:matchId` - Get match messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark message as read
- `GET /api/messages/unread-count` - Get unread count

### Subscriptions (To be implemented)
- `POST /api/subscriptions/create` - Create subscription
- `POST /api/subscriptions/cancel` - Cancel subscription
- `GET /api/subscriptions/status` - Get subscription status
- `POST /api/subscriptions/webhook` - Stripe webhook

## Environment Variables 🔧

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/wonder-dating
MONGODB_TEST_URI=mongodb://localhost:27017/wonder-dating-test

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Apple Sign In
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY_PATH=./keys/AuthKey.p8

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Python Path
PYTHON_PATH=/usr/bin/python3

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Third-Party Services Setup 🛠️

### 1. MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and add to `MONGODB_URI`

### 2. OpenAI API
1. Sign up at [OpenAI](https://platform.openai.com/)
2. Generate API key
3. Add to `OPENAI_API_KEY`

### 3. Cloudinary
1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get cloud name, API key, and secret from dashboard
3. Add to environment variables

### 4. Stripe
1. Create account at [Stripe](https://stripe.com/)
2. Get secret key and webhook secret
3. Add to environment variables
4. Set up webhook endpoint: `https://yourapi.com/api/subscriptions/webhook`

### 5. Apple Developer (for Apple Sign In)
1. Enroll in Apple Developer Program
2. Create App ID with Sign In with Apple capability
3. Generate private key and get team ID, key ID
4. Add to environment variables

## Deployment 🚀

### Backend Deployment (Heroku/Railway/DigitalOcean)

1. **Build the project:**
   ```bash
   cd backend
   npm run build
   ```

2. **Set environment variables** on your hosting platform

3. **Deploy** using your platform's CLI or web interface

### Frontend Deployment

1. **Build for production:**
   ```bash
   # For iOS
   eas build --platform ios --profile production
   
   # For Android
   eas build --platform android --profile production
   ```

2. **Submit to app stores** using EAS Submit or manually

## Development Workflow 💻

### Running in Development

1. **Start backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start frontend (in new terminal):**
   ```bash
   npm start
   ```

3. **Access the app:**
   - iOS Simulator: Press `i` in Expo CLI
   - Android Emulator: Press `a` in Expo CLI
   - Physical device: Scan QR code

### Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

## Key Features Implementation 🔑

### 1. AI Matchmaking
- Uses OpenAI GPT to analyze user preferences and behavior
- Generates compatibility scores and recommendations
- Provides conversation starters and profile suggestions

### 2. Facial Recognition
- DeepFace library for facial similarity detection
- Python integration with Node.js backend
- Secure image processing and cleanup

### 3. Real-time Chat
- Socket.IO for instant messaging
- Typing indicators and read receipts
- Online status tracking

### 4. Premium Features
- Stripe subscription management
- Feature gating for premium users
- Webhook handling for subscription updates

## Security Features 🔒

- JWT token authentication
- Rate limiting on all endpoints
- Input validation and sanitization
- Secure file upload handling
- CORS protection
- Helmet.js security headers
- Password hashing with bcrypt

## Performance Optimizations ⚡

- Database indexing for fast queries
- Image optimization with Sharp
- Cloudinary CDN for image delivery
- Connection pooling for database
- Efficient pagination for large datasets

## Troubleshooting 🔧

### Common Issues

1. **MongoDB Connection Failed**
   - Check if MongoDB is running locally
   - Verify connection string in `.env`
   - Ensure network access for MongoDB Atlas

2. **Python/DeepFace Issues**
   - Install Python dependencies: `pip install -r requirements.txt`
   - Check Python path in environment variables
   - Ensure OpenCV is properly installed

3. **Image Upload Failures**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper CORS configuration

4. **Socket.IO Connection Issues**
   - Check CORS settings in server
   - Verify client-server URL configuration
   - Test with network debugging tools

## Contributing 🤝

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support 💬

For support and questions:
- Create an issue on GitHub
- Email: support@wonderdating.com
- Documentation: [docs.wonderdating.com](https://docs.wonderdating.com)

---

Built with ❤️ by the Wonder Team