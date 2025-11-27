#!/bin/bash

# Setup SSL certificate for develop.matrixlab.work
# This script should be run with sudo

echo "Setting up SSL certificate for develop.matrixlab.work..."

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo "Certbot not found. Installing certbot..."
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
fi

# Stop nginx temporarily if running
systemctl stop nginx 2>/dev/null || true

# Obtain SSL certificate
certbot certonly --standalone \
    -d develop.matrixlab.work \
    --non-interactive \
    --agree-tos \
    --email admin@matrixlab.work \
    --preferred-challenges http

# Copy nginx configuration
cp nginx.conf /etc/nginx/sites-available/develop.matrixlab.work
ln -sf /etc/nginx/sites-available/develop.matrixlab.work /etc/nginx/sites-enabled/

# Test nginx configuration
nginx -t

# Restart nginx
systemctl restart nginx

# Setup auto-renewal
certbot renew --dry-run

echo "SSL certificate setup complete!"
echo "Certificate will auto-renew via certbot systemd timer"
