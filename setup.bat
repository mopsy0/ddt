@echo off
echo 🚀 Setting up Wonder Dating App...
echo ==================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8+ and try again.
    pause
    exit /b 1
)

echo ✅ Prerequisites check completed
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

REM Install Python dependencies
echo 🐍 Installing Python dependencies...
cd src\python
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)
cd ..\..

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit backend\.env with your actual configuration values
)

cd ..

REM Install frontend dependencies
echo 📱 Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Check if Expo CLI is installed
expo --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔧 Installing Expo CLI...
    call npm install -g @expo/cli
)

echo.
echo ✅ Setup completed successfully!
echo.
echo Next steps:
echo 1. Edit backend\.env with your configuration (MongoDB, OpenAI, Cloudinary, etc.)
echo 2. Start the backend: cd backend ^&^& npm run dev
echo 3. Start the frontend: npm start
echo.
echo 📚 Check README.md for detailed setup instructions
echo 🐛 If you encounter issues, check the troubleshooting section in README.md
echo.
echo Happy coding! 💕
pause