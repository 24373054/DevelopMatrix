#!/bin/bash

# Stop script for 刻熵科技官网
# Only manages port 3108 - does not interfere with other services

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Stopping 刻熵科技官网..."

# Check if PID file exists
if [ -f logs/app.pid ]; then
    PID=$(cat logs/app.pid)
    
    # Check if process is running
    if ps -p $PID > /dev/null 2>&1; then
        echo "Stopping process (PID: $PID)..."
        kill $PID
        
        # Wait for process to stop
        for i in {1..10}; do
            if ! ps -p $PID > /dev/null 2>&1; then
                echo "✓ Process stopped successfully"
                rm logs/app.pid
                break
            fi
            sleep 1
        done
        
        # Force kill if still running
        if ps -p $PID > /dev/null 2>&1; then
            echo "Process didn't stop gracefully, forcing..."
            kill -9 $PID
            rm logs/app.pid
            echo "✓ Process force stopped"
        fi
    else
        echo "Process not running (stale PID file)"
        rm logs/app.pid
    fi
else
    echo "No PID file found"
fi

# Double check port 3108
if lsof -Pi :3108 -sTCP:LISTEN -t >/dev/null 2>&1; then
    PID=$(lsof -Pi :3108 -sTCP:LISTEN -t)
    if ps -p $PID -o cmd= | grep -q "next start"; then
        echo "Found orphaned process on port 3108 (PID: $PID)"
        echo "Stopping it..."
        kill $PID
        sleep 2
        if lsof -Pi :3108 -sTCP:LISTEN -t >/dev/null 2>&1; then
            kill -9 $PID
        fi
        echo "✓ Orphaned process stopped"
    fi
fi

echo "✓ Website stopped"
