@echo off
echo Setting up Wonder Dating App...
echo ================================

echo Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Checking Python...
python --version
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://python.org/
    pause
    exit /b 1
)

echo Installing backend dependencies...
cd backend
npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo Installing Python dependencies...
cd src\python
pip install -r requirements.txt
cd ..\..

echo Creating .env file...
if not exist .env (
    copy .env.example .env
)

cd ..

echo Installing frontend dependencies...
npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo Installing Expo CLI...
npm install -g @expo/cli

echo.
echo Setup completed!
echo.
echo Next steps:
echo 1. Edit backend\.env with your configuration
echo 2. Start backend: cd backend && npm run dev
echo 3. Start frontend: npm start
echo.
pause