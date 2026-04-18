@echo off
REM ChainTotal Web UI Quick Start Script (Windows)

echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║        🎨 ChainTotal Web UI Quick Start 🎨              ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

REM Check if dist exists
if not exist "dist" (
    echo 🔨 Building project...
    call npm run build
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  Warning: .env file not found!
    echo 📝 Creating .env from .env.example...
    copy .env.example .env
    echo ✅ Please edit .env file with your configuration
    echo.
)

echo 🚀 Starting ChainTotal Web UI...
echo.
echo 📍 Server will be available at: http://localhost:3000
echo 📊 API Documentation: http://localhost:3000/api/health
echo.
echo Press Ctrl+C to stop the server
echo.
echo ═══════════════════════════════════════════════════════════
echo.

REM Start the server
call npm run dev:server
