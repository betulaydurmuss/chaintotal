#!/bin/bash

# ChainTotal Web UI Quick Start Script

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║        🎨 ChainTotal Web UI Quick Start 🎨              ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if dist exists
if [ ! -d "dist" ]; then
    echo "🔨 Building project..."
    npm run build
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ Please edit .env file with your configuration"
    echo ""
fi

echo "🚀 Starting ChainTotal Web UI..."
echo ""
echo "📍 Server will be available at: http://localhost:3000"
echo "📊 API Documentation: http://localhost:3000/api/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

# Start the server
npm run dev:server
