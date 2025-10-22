# Wonder Dating App - Windows Setup Guide 🪟

This guide provides step-by-step instructions for setting up the Wonder Dating App on Windows.

## Prerequisites 📋

Before starting, make sure you have the following installed:

### 1. Node.js (Required)
- Download from: https://nodejs.org/
- Install the LTS version (18.x or later)
- Verify installation: Open Command Prompt and run `node --version`

### 2. Python (Required for AI features)
- Download from: https://python.org/
- Install Python 3.8 or later
- **Important**: Check "Add Python to PATH" during installation
- Verify installation: Run `python --version` in Command Prompt

### 3. Git (Recommended)
- Download from: https://git-scm.com/
- Use default installation settings

### 4. Code Editor (Recommended)
- Visual Studio Code: https://code.visualstudio.com/
- Or any editor of your choice

## Setup Methods 🛠️

### Method 1: Automated Setup (Recommended)

1. **Open Command Prompt as Administrator**
   - Press `Win + X` and select "Command Prompt (Admin)" or "PowerShell (Admin)"

2. **Navigate to the project directory**
   ```cmd
   cd path\to\wonder-dating-app
   ```

3. **Run the setup script**
   
   For Command Prompt:
   ```cmd
   setup.bat
   ```
   
   For PowerShell:
   ```powershell
   .\setup.ps1
   ```

4. **Follow the on-screen instructions**

### Method 2: Manual Setup

If the automated setup doesn't work, follow these steps:

#### Step 1: Install Backend Dependencies

1. **Open Command Prompt**
2. **Navigate to backend directory**
   ```cmd
   cd backend
   ```
3. **Install Node.js dependencies**
   ```cmd
   npm install
   ```
4. **Navigate to Python directory**
   ```cmd
   cd src\python
   ```
5. **Install Python dependencies**
   ```cmd
   pip install -r requirements.txt
   ```
   
   If `pip` doesn't work, try:
   ```cmd
   python -m pip install -r requirements.txt
   ```
6. **Go back to backend directory**
   ```cmd
   cd ..\..
   ```
7. **Create environment file**
   ```cmd
   copy .env.example .env
   ```

#### Step 2: Install Frontend Dependencies

1. **Navigate to project root**
   ```cmd
   cd ..
   ```
2. **Install frontend dependencies**
   ```cmd
   npm install
   ```
3. **Install Expo CLI globally**
   ```cmd
   npm install -g @expo/cli
   ```

## Configuration ⚙️

### 1. Environment Variables

Edit the `backend\.env` file with your configuration:

```env
# Database (you can use MongoDB Atlas for free)
MONGODB_URI=mongodb://localhost:27017/wonder-dating

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-here

# OpenAI API Key (get from https://platform.openai.com/)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Cloudinary (get from https://cloudinary.com/)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Stripe (get from https://stripe.com/)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
```

### 2. Third-Party Services

You'll need to sign up for these services (most have free tiers):

1. **MongoDB Atlas** (Database)
   - Sign up at: https://www.mongodb.com/atlas
   - Create a free cluster
   - Get connection string

2. **OpenAI** (AI Features)
   - Sign up at: https://platform.openai.com/
   - Generate API key
   - Add billing information (required for API access)

3. **Cloudinary** (Image Storage)
   - Sign up at: https://cloudinary.com/
   - Get cloud name, API key, and secret from dashboard

4. **Stripe** (Payments - Optional)
   - Sign up at: https://stripe.com/
   - Get test API keys for development

## Running the App 🚀

### Start the Backend

1. **Open Command Prompt**
2. **Navigate to backend directory**
   ```cmd
   cd backend
   ```
3. **Start the development server**
   ```cmd
   npm run dev
   ```
4. **Verify it's running**
   - You should see: "✅ MongoDB Connected" and "🚀 Wonder Dating API server running on port 3000"
   - Test: Open http://localhost:3000/health in your browser

### Start the Frontend

1. **Open a new Command Prompt window**
2. **Navigate to project root**
   ```cmd
   cd path\to\wonder-dating-app
   ```
3. **Start Expo development server**
   ```cmd
   npm start
   ```
4. **Choose how to run the app**
   - Press `w` for web browser
   - Press `a` for Android emulator (requires Android Studio)
   - Scan QR code with Expo Go app on your phone

## Troubleshooting 🔧

### Common Issues

#### 1. "node is not recognized"
- **Solution**: Reinstall Node.js and make sure to check "Add to PATH"
- **Alternative**: Add Node.js to your PATH manually

#### 2. "python is not recognized"
- **Solution**: Reinstall Python and check "Add Python to PATH"
- **Alternative**: Use `py` instead of `python`

#### 3. "npm install" fails
- **Solution**: Clear npm cache: `npm cache clean --force`
- **Alternative**: Delete `node_modules` folder and run `npm install` again

#### 4. Python dependencies fail to install
- **Solution**: Try using pip3: `pip3 install -r requirements.txt`
- **Alternative**: Install Visual Studio Build Tools for native dependencies

#### 5. "Permission denied" errors
- **Solution**: Run Command Prompt as Administrator
- **Alternative**: Use `npm install --no-optional`

#### 6. MongoDB connection fails
- **Solution**: Use MongoDB Atlas instead of local MongoDB
- **Check**: Firewall settings and network connectivity

#### 7. Port 3000 already in use
- **Solution**: Kill the process using port 3000: `netstat -ano | findstr :3000`
- **Alternative**: Change the port in backend/.env: `PORT=3001`

### Getting Help

If you encounter issues:

1. **Check the main README.md** for detailed documentation
2. **Look at error messages** carefully - they often contain the solution
3. **Search online** for specific error messages
4. **Check Windows-specific Node.js/Python installation guides**

## Development Tips 💡

### Recommended Tools

1. **Windows Terminal** - Modern terminal with tabs
2. **Visual Studio Code** - Great for React Native development
3. **MongoDB Compass** - GUI for MongoDB
4. **Postman** - For testing API endpoints

### Useful Commands

```cmd
# Check versions
node --version
npm --version
python --version
expo --version

# Clear caches if you have issues
npm cache clean --force
expo r -c

# Kill processes on specific ports
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### VS Code Extensions

Install these extensions for better development experience:
- React Native Tools
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- Auto Rename Tag
- Bracket Pair Colorizer

## Next Steps 🎯

Once everything is set up:

1. **Explore the codebase** - Check out the backend API and frontend components
2. **Configure your services** - Set up MongoDB, OpenAI, Cloudinary accounts
3. **Test the features** - Try the authentication, photo upload, etc.
4. **Start developing** - Add new features or customize existing ones

Happy coding! 🚀💕