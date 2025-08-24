# Docker Deployment Guide for SniperSend

This guide will help you deploy SniperSend on an Amazon EC2 Ubuntu instance using Docker.

## Prerequisites

- Amazon EC2 Ubuntu instance (recommended: Ubuntu 22.04 LTS)
- Security group configured to allow inbound traffic on port 3000
- SSH access to your EC2 instance

## Step 1: Connect to Your EC2 Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

## Step 2: Install Docker and Docker Compose

```bash
# Update package list
sudo apt update

# Install required packages
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package list again
sudo apt update

# Install Docker
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add your user to docker group (optional, for running docker without sudo)
sudo usermod -aG docker $USER

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Verify Docker installation
docker --version
docker-compose --version
```

## Step 3: Upload Your Project

You have several options to get your code to the EC2 instance:

### Option A: Using SCP
```bash
# From your local machine
scp -i your-key.pem -r ./snipesend ubuntu@your-ec2-public-ip:~/
```

### Option B: Using Git
```bash
# On your EC2 instance
git clone https://github.com/yourusername/snipesend.git
cd snipesend
```

### Option C: Using AWS CodeDeploy or other CI/CD tools

## Step 4: Configure Environment Variables

Create a `.env` file with your production environment variables:

```bash
# On your EC2 instance
cd snipesend
nano .env
```

Add your environment variables:
```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
JWT_SECRET=your_jwt_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://your-domain.com
```

## Step 5: Deploy the Application

### Using the deployment script (recommended):
```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

### Manual deployment:
```bash
# Build and start the application
docker-compose up --build -d

# Check the status
docker-compose ps

# View logs
docker-compose logs -f
```

## Step 6: Configure Your Domain (Optional)

If you have a domain name, you can set up a reverse proxy using Nginx:

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/snipesend
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/snipesend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 7: Set Up SSL with Let's Encrypt (Optional)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

## Useful Commands

```bash
# View running containers
docker ps

# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Restart the application
docker-compose restart

# Update the application
git pull
docker-compose up --build -d

# View resource usage
docker stats

# Clean up unused images
docker image prune -a
```

## Troubleshooting

### Application won't start
```bash
# Check logs
docker-compose logs

# Check if port 3000 is available
sudo netstat -tlnp | grep :3000
```

### Permission issues
```bash
# Fix Docker permissions
sudo chown $USER:$USER ~/.docker -R
sudo chmod u+rwx ~/.docker -R
```

### Out of disk space
```bash
# Clean up Docker
docker system prune -a
docker volume prune
```

## Security Considerations

1. **Firewall**: Ensure only necessary ports are open
2. **Environment Variables**: Never commit sensitive data to version control
3. **Regular Updates**: Keep Docker and your application updated
4. **Monitoring**: Set up logging and monitoring for production

## Performance Optimization

1. **Resource Limits**: Set appropriate CPU and memory limits in docker-compose.yml
2. **Caching**: Use Docker layer caching effectively
3. **Monitoring**: Monitor resource usage and optimize accordingly

## Backup Strategy

```bash
# Backup your data
docker-compose exec snipesend pg_dump your_database > backup.sql

# Backup your configuration
tar -czf config-backup.tar.gz .env docker-compose.yml
```

Your SniperSend application should now be running successfully on your Amazon EC2 instance! 🎉
