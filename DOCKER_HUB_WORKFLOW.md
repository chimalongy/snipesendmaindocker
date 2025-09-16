# Docker Hub Workflow for SniperSend

This guide explains how to use Docker Hub to build your application locally and deploy it on EC2.

## 🏗️ Local Development Workflow

### Step 1: Set Up Docker Hub Account

1. Create a Docker Hub account at [hub.docker.com](https://hub.docker.com)
2. Create a repository called `snipesend`
3. Login to Docker Hub locally:
   ```bash
   docker login
   ```

### Step 2: Configure Your Username

Edit `build-and-push.sh` and replace `yourusername` with your actual Docker Hub username:

```bash
DOCKER_USERNAME="yourusername"  # Replace with your Docker Hub username
```

### Step 3: Build and Push to Docker Hub

```bash
# Make the script executable
chmod +x build-and-push.sh

# Build and push to Docker Hub
./build-and-push.sh
```

This will:
- Build your Docker image locally
- Tag it with your Docker Hub username
- Push it to Docker Hub

## 🚀 EC2 Deployment Workflow

### Step 1: Update docker-compose.yml

Make sure your `docker-compose.yml` uses the `image` directive (not `build`):

```yaml
services:
  snipesend:
    image: yourusername/snipesend:latest
    # ... rest of configuration
```

### Step 2: Deploy on EC2

```bash
# Pull and run the latest image
./deploy.sh
```

## 🔄 Complete Workflow

### Development Cycle:

1. **Make changes** to your code locally
2. **Test locally** with `docker-compose up --build`
3. **Build and push** to Docker Hub: `./build-and-push.sh`
4. **Deploy on EC2**: `./deploy.sh`

### Commands Summary:

| Action | Local Machine | EC2 Instance |
|--------|---------------|--------------|
| Build Image | `./build-and-push.sh` | N/A |
| Run Locally | `docker-compose up --build` | N/A |
| Deploy | N/A | `./deploy.sh` |
| Update | `./build-and-push.sh` | `./deploy.sh` |
| View Logs | `docker-compose logs -f` | `docker-compose logs -f` |

## 🏷️ Image Tagging Strategy

### Recommended Tags:

- `latest` - Always points to the most recent stable version
- `v1.0.0` - Semantic versioning for releases
- `develop` - Development builds

### Example with Multiple Tags:

```bash
# Tag with version
docker tag yourusername/snipesend:latest yourusername/snipesend:v1.0.0

# Push both tags
docker push yourusername/snipesend:latest
docker push yourusername/snipesend:v1.0.0
```

## 📊 Benefits of This Approach

### ✅ Advantages:

1. **Faster EC2 Deployment** - No need to build on EC2
2. **Consistent Images** - Same image runs everywhere
3. **Version Control** - Easy to rollback to previous versions
4. **CI/CD Ready** - Can be integrated with GitHub Actions, etc.
5. **Resource Efficient** - EC2 doesn't need build tools

### ⚠️ Considerations:

1. **Docker Hub Rate Limits** - Free accounts have pull limits
2. **Image Size** - Large images take longer to pull
3. **Security** - Images are publicly accessible (unless you have a paid plan)

## 🔒 Security Best Practices

### For Production:

1. **Use Private Repositories** (requires Docker Hub paid plan)
2. **Scan Images** for vulnerabilities:
   ```bash
   docker scan yourusername/snipesend:latest
   ```
3. **Use Specific Tags** instead of `latest` in production
4. **Sign Images** with Docker Content Trust

### Environment Variables:

Never commit sensitive data. Use `.env` files on your EC2 instance:

```bash
# On EC2, create .env file
nano .env

# Add your production variables
DATABASE_URL=your_production_db_url
GMAIL_CLIENT_ID=your_gmail_client_id
# ... etc
```

## 🚀 Advanced Workflow

### Automated Deployment:

You can set up GitHub Actions to automatically build and push on every commit:

```yaml
# .github/workflows/docker.yml
name: Build and Push Docker Image
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Build and push
      uses: docker/build-push-action@v2
      with:
        push: true
        tags: yourusername/snipesend:latest
```

### Multi-Environment Deployment:

```yaml
# docker-compose.prod.yml
services:
  snipesend:
    image: yourusername/snipesend:latest
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
```

## 🐛 Troubleshooting

### Common Issues:

1. **Authentication Failed**:
   ```bash
   docker login
   ```

2. **Image Not Found**:
   - Check your Docker Hub username
   - Verify the repository exists
   - Check if the image was pushed successfully

3. **Pull Rate Limited**:
   - Upgrade to Docker Hub paid plan
   - Use image caching strategies

4. **Permission Denied**:
   ```bash
   sudo usermod -aG docker $USER
   # Then log out and back in
   ```

## 📈 Monitoring and Maintenance

### Regular Tasks:

1. **Clean Up Old Images**:
   ```bash
   docker image prune -a
   ```

2. **Update Base Images**:
   - Regularly update your Dockerfile base images
   - Monitor for security updates

3. **Monitor Resource Usage**:
   ```bash
   docker stats
   ```

This workflow gives you a professional, scalable deployment process that's perfect for production use! 🎉

