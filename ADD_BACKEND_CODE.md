# Adding Complete Backend Code to Wonder Dating App 🔧

Let's add all the backend code files step by step. Make sure you're in the project directory first.

## Step 1: Navigate to Backend Directory

```cmd
cd C:\Users\%USERNAME%\Desktop\wonder-dating-app\backend
```

## Step 2: Create TypeScript Configuration

Create `tsconfig.json`:
```cmd
notepad tsconfig.json
```

Paste this content:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

## Step 3: Update Environment File

Update `.env` with complete configuration:
```cmd
notepad .env
```

Replace content with:
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

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Apple Sign In
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY_PATH=./keys/AuthKey.p8

# Stripe (for subscriptions)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Python Path (for DeepFace)
PYTHON_PATH=/usr/bin/python3

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Step 4: Create Python Requirements

```cmd
cd src\python
notepad requirements.txt
```

Paste this content:
```txt
deepface==0.0.79
opencv-python==4.8.1.78
tensorflow==2.13.0
numpy==1.24.3
Pillow==10.0.1
requests==2.31.0
opencv-contrib-python==4.8.1.78
```

## Step 5: Create Main Files

I'll guide you through creating each file. Let's start with the most important ones:

### 5.1: Types Definition
```cmd
cd ..\types
notepad index.ts
```

This is a large file with all TypeScript interfaces. I'll provide it in the next message.

### 5.2: Database Configuration
```cmd
cd ..\config
notepad database.ts
```

### 5.3: User Model
```cmd
cd ..\models
notepad User.ts
```

### 5.4: Authentication Middleware
```cmd
cd ..\middleware
notepad auth.ts
```

### 5.5: Main Server File
```cmd
cd ..
notepad server.ts
```

## File Creation Order

I'll help you create these files in this order:
1. ✅ TypeScript config (done)
2. ✅ Environment file (done)
3. ✅ Python requirements (done)
4. 📝 Types definition
5. 📝 Database configuration
6. 📝 User model
7. 📝 Other models (Match, Message, Swipe, Subscription)
8. 📝 Authentication middleware  
9. 📝 Upload middleware
10. 📝 AI services
11. 📝 Authentication routes
12. 📝 Main server file

## Ready for Next Step?

Type "ready" when you've created the files above, and I'll give you the content for each file one by one.

The files will include:
- Complete user authentication system
- AI-powered matchmaking
- Real-time chat with Socket.IO
- Image upload handling
- Subscription management
- All database models and relationships
- Security middleware
- API routes

This will be a fully functional backend API!