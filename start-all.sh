#!/bin/bash

# Start script for 刻熵科技官网
# Only manages port 3108 - does not interfere with other services

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Starting 刻熵科技官网..."

# Check if already running
if lsof -Pi :3108 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Warning: Port 3108 is already in use"
    echo "Checking if it's our process..."
    PID=$(lsof -Pi :3108 -sTCP:LISTEN -t)
    if ps -p $PID -o cmd= | grep -q "next start"; then
        echo "Website is already running (PID: $PID)"
        exit 0
    else
        echo "Port 3108 is occupied by another process (PID: $PID)"
        echo "Please stop that process first or use a different port"
        exit 1
    fi
fi

# Start the Next.js application
echo "Starting Next.js application on port 3108..."
nohup npm start > logs/app.log 2>&1 &
APP_PID=$!

# Save PID
mkdir -p logs
echo $APP_PID > logs/app.pid

# Wait a moment and check if it started successfully
sleep 3

if ps -p $APP_PID > /dev/null; then
    echo "✓ Website started successfully (PID: $APP_PID)"
    echo "✓ Running on http://localhost:3108"
    echo "✓ Logs: logs/app.log"
    echo ""
    echo "To view logs: tail -f logs/app.log"
    echo "To stop: ./stop-all.sh"
else
    echo "✗ Failed to start website"
    echo "Check logs/app.log for details"
    exit 1
fi
