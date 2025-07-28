# Wonder Dating App Setup Script (PowerShell)
# This script helps set up the development environment on Windows

Write-Host "🚀 Setting up Wonder Dating App..." -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ and try again." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Python is installed
try {
    $pythonVersion = python --version
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python is not installed. Please install Python 3.8+ and try again." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "✅ Prerequisites check completed" -ForegroundColor Green
Write-Host ""

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
try {
    npm install
    Write-Host "✅ Backend dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install Python dependencies
Write-Host "🐍 Installing Python dependencies..." -ForegroundColor Yellow
Set-Location src\python
try {
    pip install -r requirements.txt
    Write-Host "✅ Python dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install Python dependencies" -ForegroundColor Red
    Write-Host "💡 Try using 'pip3' instead of 'pip' if you have multiple Python versions" -ForegroundColor Yellow
    Read-Host "Press Enter to continue anyway"
}
Set-Location ..\..

# Create .env file if it doesn't exist
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "⚠️  Please edit backend\.env with your actual configuration values" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

Set-Location ..

# Install frontend dependencies
Write-Host "📱 Installing frontend dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✅ Frontend dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Expo CLI is installed
try {
    $expoVersion = expo --version
    Write-Host "✅ Expo CLI found: $expoVersion" -ForegroundColor Green
} catch {
    Write-Host "🔧 Installing Expo CLI..." -ForegroundColor Yellow
    try {
        npm install -g @expo/cli
        Write-Host "✅ Expo CLI installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install Expo CLI" -ForegroundColor Red
        Write-Host "💡 You may need to run PowerShell as Administrator" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit backend\.env with your configuration (MongoDB, OpenAI, Cloudinary, etc.)" -ForegroundColor White
Write-Host "2. Start the backend: cd backend && npm run dev" -ForegroundColor White
Write-Host "3. Start the frontend: npm start" -ForegroundColor White
Write-Host ""
Write-Host "📚 Check README.md for detailed setup instructions" -ForegroundColor Yellow
Write-Host "🐛 If you encounter issues, check the troubleshooting section in README.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "Happy coding! 💕" -ForegroundColor Magenta

Read-Host "Press Enter to exit"