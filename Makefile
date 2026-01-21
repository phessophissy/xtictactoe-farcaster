# xTicTacToe Farcaster MiniApp - Development Makefile

.PHONY: help dev build start lint clean test install deps docker-build docker-run docker-stop

# Default target
help: ## Show this help message
	@echo "xTicTacToe Farcaster MiniApp - Development Commands"
	@echo ""
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

# Development
dev: ## Start development server
	@echo "🚀 Starting development server..."
	npm run dev

build: ## Build for production
	@echo "🔨 Building for production..."
	npm run build

start: ## Start production server
	@echo "🌐 Starting production server..."
	npm run start

# Code Quality
lint: ## Run ESLint
	@echo "🔍 Running linter..."
	npm run lint

lint-fix: ## Run ESLint with auto-fix
	@echo "🔧 Running linter with auto-fix..."
	npx eslint . --ext .ts,.tsx,.js,.jsx --fix

# Dependencies
install: ## Install dependencies
	@echo "📦 Installing dependencies..."
	npm install

deps: ## Check for outdated dependencies
	@echo "📊 Checking for outdated dependencies..."
	npm outdated

deps-update: ## Update dependencies
	@echo "⬆️  Updating dependencies..."
	npm update

# Testing (if tests are added later)
test: ## Run tests (placeholder)
	@echo "🧪 Running tests..."
	@echo "No tests configured yet. Add test scripts to package.json"

# Docker
docker-build: ## Build Docker image
	@echo "🐳 Building Docker image..."
	docker build -t xtictactoe-farcaster .

docker-run: ## Run Docker container
	@echo "🐳 Running Docker container..."
	docker run -p 3000:3000 xtictactoe-farcaster

docker-stop: ## Stop Docker containers
	@echo "🛑 Stopping Docker containers..."
	docker stop $$(docker ps -q --filter ancestor=xtictactoe-farcaster) || true

docker-compose-up: ## Start services with docker-compose
	@echo "🐳 Starting services with docker-compose..."
	docker-compose up -d

docker-compose-down: ## Stop services with docker-compose
	@echo "🛑 Stopping services with docker-compose..."
	docker-compose down

# Smart Contracts (if needed)
contracts-compile: ## Compile smart contracts (placeholder)
	@echo "⚡ Compiling smart contracts..."
	@echo "Add Hardhat or Foundry setup for contract compilation"

# Cleanup
clean: ## Clean build artifacts
	@echo "🧹 Cleaning build artifacts..."
	rm -rf .next
	rm -rf node_modules/.cache
	rm -rf out

clean-all: ## Clean everything including node_modules
	@echo "🧹 Cleaning everything..."
	rm -rf .next
	rm -rf node_modules
	rm -rf out

# Environment
env-check: ## Check environment setup
	@echo "🔍 Checking environment..."
	@node --version
	@npm --version
	@echo "✅ Environment check complete"

# Deployment (placeholder)
deploy: ## Deploy to production (placeholder)
	@echo "🚀 Deploying to production..."
	@echo "Configure deployment target (Vercel, Netlify, etc.)"