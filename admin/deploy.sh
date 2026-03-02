#!/bin/bash

# EDIZO Admin Panel - Quick Deploy Script for Netlify
# Usage: ./deploy.sh

echo "🚀 EDIZO Admin Panel - Netlify Deployment"
echo "=========================================="
echo ""

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI is not installed."
    echo "   Install it with: npm install -g netlify-cli"
    exit 1
fi

# Check if logged in
echo "🔐 Checking Netlify login status..."
if ! netlify status &> /dev/null; then
    echo "   Please login to Netlify..."
    netlify login
fi

# Change to admin directory
cd "$(dirname "$0")"

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "   Creating from .env.example..."
    cp .env.example .env
    echo ""
    echo "   Please edit .env and set VITE_API_URL to your backend URL"
    echo "   Example: VITE_API_URL=https://your-backend.onrender.com/api"
    echo ""
    read -p "Press Enter after you've updated .env..."
fi

# Load environment variables
source .env

echo ""
echo "📦 Building admin panel..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check for errors above."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=dist

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "📍 Your site is live at:"
    netlify open
else
    echo ""
    echo "❌ Deployment failed! Please check the errors above."
fi
