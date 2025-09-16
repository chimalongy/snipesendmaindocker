#!/bin/bash

# SniperSend Docker Build and Push Script
# This script builds your Docker image locally and pushes it to Docker Hub

# Configuration
DOCKER_USERNAME="yourusername"  # Replace with your Docker Hub username
IMAGE_NAME="snipesend"
TAG="latest"

echo "🐳 Building and pushing SniperSend to Docker Hub..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if user is logged into Docker Hub
if ! docker info | grep -q "Username"; then
    echo "❌ You are not logged into Docker Hub. Please run 'docker login' first."
    exit 1
fi

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t $DOCKER_USERNAME/$IMAGE_NAME:$TAG .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

# Tag the image
echo "🏷️  Tagging image..."
docker tag $DOCKER_USERNAME/$IMAGE_NAME:$TAG $DOCKER_USERNAME/$IMAGE_NAME:$TAG

# Push to Docker Hub
echo "📤 Pushing to Docker Hub..."
docker push $DOCKER_USERNAME/$IMAGE_NAME:$TAG

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed $DOCKER_USERNAME/$IMAGE_NAME:$TAG to Docker Hub!"
    echo ""
    echo "🌐 Your image is now available at:"
    echo "   https://hub.docker.com/r/$DOCKER_USERNAME/$IMAGE_NAME"
    echo ""
    echo "📥 On your EC2 instance, you can now pull it with:"
    echo "   docker pull $DOCKER_USERNAME/$IMAGE_NAME:$TAG"
    echo ""
    echo "🚀 Or use docker-compose to pull and run:"
    echo "   docker-compose pull"
    echo "   docker-compose up -d"
else
    echo "❌ Failed to push to Docker Hub!"
    exit 1
fi

