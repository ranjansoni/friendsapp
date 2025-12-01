#!/bin/bash
set -e

echo "🚀 Starting Friends App deployment..."

# Configuration
LOCAL_PATH="/Users/ranjansoni/Projects/AI Projects/Ranjan Friends"
SERVER_USER="ubuntu"
SERVER_DOMAIN="friends.ranjansoni.com"
SERVER_IP=""  # Will be resolved from domain, or set manually if needed
SERVER_PATH="/home/ubuntu/friendsapp"
KEY_FILE="pulsekey.pem"
TARBALL="friendsapp-deploy.tar.gz"
APP_NAME="friendsapp"
PORT=3310
FIRST_DEPLOY="${1:-false}"  # Pass 'first' as argument for first deployment

# Resolve server IP from domain if not set
if [ -z "$SERVER_IP" ]; then
    SERVER_IP=$(dig +short $SERVER_DOMAIN | tail -n1)
    if [ -z "$SERVER_IP" ]; then
        echo "⚠️  Could not resolve $SERVER_DOMAIN. Please set SERVER_IP manually in the script."
        exit 1
    fi
    echo "📡 Resolved $SERVER_DOMAIN to $SERVER_IP"
fi

cd "$LOCAL_PATH"

# Build tarball
echo "📦 Creating deployment package..."
if [ "$FIRST_DEPLOY" = "first" ]; then
    echo "   Including .env.local for first deployment..."
    tar --exclude='node_modules' \
        --exclude='.next' \
        --exclude='.turbo' \
        --exclude='.git' \
        --exclude='*.log' \
        --exclude='.DS_Store' \
        --exclude='._*' \
        -czf $TARBALL .
else
    echo "   Excluding .env files (normal deployment)..."
    tar --exclude='node_modules' \
        --exclude='.next' \
        --exclude='.env*' \
        --exclude='.turbo' \
        --exclude='.git' \
        --exclude='*.log' \
        --exclude='.DS_Store' \
        --exclude='._*' \
        -czf $TARBALL .
fi

# Upload
echo "⬆️  Uploading to server..."
scp -i $KEY_FILE $TARBALL $SERVER_USER@$SERVER_IP:$SERVER_PATH/

# Deploy on server
echo "🔧 Deploying on server..."
ssh -i $KEY_FILE $SERVER_USER@$SERVER_IP << ENDSSH
cd $SERVER_PATH

# Backup existing deployment
if [ -d "app" ]; then
    echo "📋 Creating backup..."
    rm -rf app_backup
    cp -r app app_backup 2>/dev/null || true
fi

# Extract new deployment
echo "📂 Extracting files..."
mkdir -p /tmp/${APP_NAME}_deploy
tar --no-same-owner -xzf $TARBALL -C /tmp/${APP_NAME}_deploy/
rm -rf app
mv /tmp/${APP_NAME}_deploy app
cd $SERVER_PATH/app

# Permissions
sudo chown -R $SERVER_USER:$SERVER_USER .
find . -name '._*' -delete
find . -name '.DS_Store' -delete

# Check for .env file
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found!"
    echo "   For first deployment, run: ./deploy.sh first"
    echo "   Then update .env.local on the server with production values"
    if [ ! -f "../.env.local" ]; then
        echo "❌ No .env.local file found in parent directory either!"
        exit 1
    fi
    echo "   Copying .env.local from parent directory..."
    cp ../.env.local .
fi

echo "📦 Installing dependencies..."
npm install || {
    echo "❌ npm install failed!"
    exit 1
}

echo "🗄️  Generating Prisma client..."
npx prisma generate || {
    echo "❌ Prisma generate failed!"
    exit 1
}

echo "🔄 Pushing database schema..."
# Use db push instead of migrate for development/production sync
npx prisma db push --accept-data-loss || {
    echo "❌ Database schema push failed!"
    exit 1
}

echo "🏗️  Building application..."
npm run build || {
    echo "❌ Build failed!"
    exit 1
}

# Verify build
if [ ! -d ".next" ]; then
    echo "❌ Build failed - .next directory not created!"
    exit 1
fi

# Restart with PM2
echo "🔄 Restarting application..."
# Check if app is already running
if pm2 list | grep -q "$APP_NAME"; then
    PORT=$PORT pm2 restart $APP_NAME
else
    PORT=$PORT pm2 start npm --name "$APP_NAME" -- start
fi
pm2 save

# Cleanup
cd $SERVER_PATH
rm $TARBALL

echo "✅ Deployment complete!"
pm2 status
ENDSSH

# Cleanup local
rm $TARBALL

echo ""
echo "🎉 Done! Your Friends App is deployed!"
echo ""
echo "📊 Useful commands:"
echo "   View logs:    ssh -i $KEY_FILE $SERVER_USER@$SERVER_IP 'pm2 logs $APP_NAME --lines 50'"
echo "   Check status: ssh -i $KEY_FILE $SERVER_USER@$SERVER_IP 'pm2 status'"
echo "   Restart app:  ssh -i $KEY_FILE $SERVER_USER@$SERVER_IP 'pm2 restart $APP_NAME'"
echo ""
echo "🌐 Your app is running on port $PORT"
echo "   Direct access: http://$SERVER_IP:$PORT"
echo "   Domain access: https://$SERVER_DOMAIN (via nginx reverse proxy)"
echo ""