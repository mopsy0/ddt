# Wonder Dating App - Manual Setup Guide 🛠️

If the automated scripts aren't working, follow this step-by-step guide.

## Prerequisites Check ✅

First, verify you have the required software installed:

### 1. Check Node.js
Open Command Prompt and run:
```cmd
node --version
```
**Should show**: `v18.x.x` or higher

**If not installed**:
- Download from: https://nodejs.org/
- Install the LTS version
- **Important**: Restart Command Prompt after installation

### 2. Check npm
```cmd
npm --version
```
**Should show**: `9.x.x` or higher (comes with Node.js)

### 3. Check Python
```cmd
python --version
```
**Should show**: `Python 3.8.x` or higher

**If not installed**:
- Download from: https://python.org/
- **Important**: Check "Add Python to PATH" during installation
- Restart Command Prompt after installation

**Alternative**: If `python` doesn't work, try:
```cmd
py --version
```

## Step-by-Step Setup 📋

### Step 1: Backend Dependencies

1. **Open Command Prompt**
2. **Navigate to your project folder**:
   ```cmd
   cd C:\path\to\your\wonder-dating-app
   ```
   (Replace with your actual path)

3. **Go to backend folder**:
   ```cmd
   cd backend
   ```

4. **Install Node.js dependencies**:
   ```cmd
   npm install
   ```
   
   **Wait for completion** - this may take 2-5 minutes

   **If this fails**:
   ```cmd
   npm cache clean --force
   npm install
   ```

### Step 2: Python Dependencies

1. **Navigate to Python folder** (from backend directory):
   ```cmd
   cd src\python
   ```

2. **Install Python packages**:
   ```cmd
   pip install -r requirements.txt
   ```

   **If pip doesn't work, try one of these**:
   ```cmd
   python -m pip install -r requirements.txt
   ```
   or
   ```cmd
   py -m pip install -r requirements.txt
   ```

   **Note**: This may take 5-10 minutes as it downloads AI libraries

3. **Go back to backend folder**:
   ```cmd
   cd ..\..
   ```

### Step 3: Environment Configuration

1. **Create environment file** (from backend directory):
   ```cmd
   copy .env.example .env
   ```

2. **Edit the .env file**:
   - Open `backend\.env` in any text editor (Notepad, VS Code, etc.)
   - Replace the placeholder values with your actual configuration
   - **Minimum required**: Set `MONGODB_URI` to a MongoDB connection string

### Step 4: Frontend Dependencies

1. **Go back to project root**:
   ```cmd
   cd ..
   ```

2. **Install frontend dependencies**:
   ```cmd
   npm install
   ```

   **If this fails**:
   ```cmd
   npm cache clean --force
   npm install
   ```

### Step 5: Install Expo CLI

```cmd
npm install -g @expo/cli
```

**If permission error**:
- Run Command Prompt as Administrator
- Or try: `npm install -g @expo/cli --force`

## Testing the Setup 🧪

### Test Backend

1. **Navigate to backend**:
   ```cmd
   cd backend
   ```

2. **Start the server**:
   ```cmd
   npm run dev
   ```

3. **Check if it works**:
   - Should see: "✅ MongoDB Connected" (if MongoDB is configured)
   - Should see: "🚀 Wonder Dating API server running on port 3000"
   - Open browser to: http://localhost:3000/health

4. **Stop the server**: Press `Ctrl + C`

### Test Frontend

1. **Go to project root** (open new Command Prompt):
   ```cmd
   cd C:\path\to\your\wonder-dating-app
   ```

2. **Start Expo**:
   ```cmd
   npm start
   ```

3. **Should see**:
   - Expo DevTools opening in browser
   - QR code in terminal
   - Options to press 'w' for web, 'a' for Android, etc.

## Common Issues & Solutions 🔧

### Issue: "node is not recognized"
**Solution**:
1. Reinstall Node.js from https://nodejs.org/
2. Make sure to check "Add to PATH" during installation
3. Restart Command Prompt
4. Try again

### Issue: "python is not recognized"
**Solutions**:
1. Try `py` instead of `python`
2. Reinstall Python with "Add Python to PATH" checked
3. Manually add Python to PATH:
   - Find Python installation (usually `C:\Python39\` or similar)
   - Add to Windows PATH environment variable

### Issue: "npm install" fails
**Solutions**:
1. Run Command Prompt as Administrator
2. Clear cache: `npm cache clean --force`
3. Delete `node_modules` folder and try again
4. Check internet connection

### Issue: Python packages fail to install
**Solutions**:
1. Try: `python -m pip install --upgrade pip`
2. Try: `pip install --user -r requirements.txt`
3. Install Visual Studio Build Tools if you get compilation errors

### Issue: "Permission denied"
**Solutions**:
1. Run Command Prompt as Administrator
2. For npm: `npm install --no-optional`
3. For Python: `pip install --user`

### Issue: Port 3000 already in use
**Solutions**:
1. Find what's using it: `netstat -ano | findstr :3000`
2. Kill the process: `taskkill /PID <PID_NUMBER> /F`
3. Or change port in `backend\.env`: `PORT=3001`

## Quick Commands Summary 📝

Here are all the commands in order:

```cmd
# Check prerequisites
node --version
npm --version
python --version

# Navigate to project
cd C:\path\to\your\wonder-dating-app

# Backend setup
cd backend
npm install
cd src\python
pip install -r requirements.txt
cd ..\..
copy .env.example .env
cd ..

# Frontend setup
npm install
npm install -g @expo/cli

# Test backend
cd backend
npm run dev

# Test frontend (in new Command Prompt)
cd C:\path\to\your\wonder-dating-app
npm start
```

## What Each Step Does 📖

1. **Backend npm install**: Downloads Node.js packages for the API server
2. **Python pip install**: Downloads AI libraries (DeepFace, OpenAI, etc.)
3. **Environment file**: Configuration for database, API keys, etc.
4. **Frontend npm install**: Downloads React Native and Expo packages
5. **Expo CLI**: Tool for running React Native apps

## Next Steps After Setup ✨

1. **Configure services**:
   - Sign up for MongoDB Atlas (free database)
   - Get OpenAI API key (for AI features)
   - Set up Cloudinary (for image storage)

2. **Edit backend\.env** with your actual API keys

3. **Start developing**:
   - Backend: `cd backend && npm run dev`
   - Frontend: `npm start`

## Need Help? 💬

If you're still having issues:

1. **Check the exact error message** - copy and paste it
2. **Verify prerequisites** - make sure Node.js and Python are properly installed
3. **Try each step individually** - don't run everything at once
4. **Use Administrator Command Prompt** - many issues are permission-related

The most common issue is Node.js or Python not being in the PATH. Make sure to restart Command Prompt after installing them!