#!/bin/bash

# SniperSend Docker Deployment Script for Amazon EC2
# Make sure to run this script from your project directory

echo "🚀 Starting SniperSend deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Stop and remove existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove old images to free up space
echo "🧹 Cleaning up old images..."
docker image prune -f

# Build and start the application
echo "🔨 Building and starting SniperSend..."
docker-compose up --build -d

# Wait for the application to start
echo "⏳ Waiting for application to start..."
sleep 10

# Check if the application is running
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ SniperSend is running successfully on port 3000!"
    echo "🌐 Access your application at: http://your-ec2-public-ip:3000"
else
    echo "❌ Application failed to start. Check logs with: docker-compose logs"
    exit 1
fi

echo "📋 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop app: docker-compose down"
echo "  Restart app: docker-compose restart"
echo "  Update app: ./deploy.sh"
