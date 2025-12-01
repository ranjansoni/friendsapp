#!/bin/bash
set -e

echo "🚀 Starting Data Migration..."

# Configuration
LOCAL_PATH="/Users/ranjansoni/Projects/AI Projects/Ranjan Friends"
SERVER_USER="ubuntu"
SERVER_DOMAIN="friends.ranjansoni.com"
SERVER_IP=""  # Will be resolved from domain
SERVER_PATH="/home/ubuntu/friendsapp"
KEY_FILE="pulsekey.pem"
DATA_FILE="data_dump.json"

# Resolve server IP
if [ -z "$SERVER_IP" ]; then
    SERVER_IP=$(dig +short $SERVER_DOMAIN | tail -n1)
    if [ -z "$SERVER_IP" ]; then
        echo "⚠️  Could not resolve $SERVER_DOMAIN. Please set SERVER_IP manually."
        exit 1
    fi
    echo "📡 Resolved $SERVER_DOMAIN to $SERVER_IP"
fi

cd "$LOCAL_PATH"

# 1. Export local data
echo "📦 Exporting local data..."
npx ts-node scripts/export_data.ts

if [ ! -f "$DATA_FILE" ]; then
    echo "❌ Data export failed - $DATA_FILE not found!"
    exit 1
fi

# 2. Upload data to server
echo "⬆️  Uploading data to server..."
scp -i $KEY_FILE $DATA_FILE $SERVER_USER@$SERVER_IP:$SERVER_PATH/app/

# 3. Import data on server
echo "📥 Importing data on server..."
ssh -i $KEY_FILE $SERVER_USER@$SERVER_IP << ENDSSH
cd $SERVER_PATH/app

if [ ! -f "$DATA_FILE" ]; then
    echo "❌ Data file not found on server!"
    exit 1
fi

echo "   Running import script..."
npx ts-node scripts/import_data.ts

# Cleanup
rm $DATA_FILE
ENDSSH

# Cleanup local
rm $DATA_FILE

echo "✅ Data migration complete!"
