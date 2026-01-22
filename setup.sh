#!/bin/bash

# xTicTacToe Farcaster MiniApp - Development Setup Script
echo "🚀 Setting up xTicTacToe Farcaster MiniApp development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d"." -f1 | cut -d"v" -f2)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.example exists and create .env.local if it doesn't exist
if [ -f ".env.example" ] && [ ! -f ".env.local" ]; then
    echo "📋 Setting up environment variables..."
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
    echo "   Please update .env.local with your actual configuration values"
fi

echo "🎉 Setup complete!"
echo ""
echo "Available commands:"
echo "  make help         - Show all available commands"
echo "  make dev          - Start development server"
echo "  make build        - Build for production"
echo "  make lint         - Run ESLint"
echo "  make docker-build - Build Docker image"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your configuration (if not done already)"
echo "2. Run 'make dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For Farcaster MiniApp development:"
echo "- Ensure you have a Farcaster account"
echo "- Configure your wallet connection settings"
echo "- Test on Farcaster-compatible browsers"