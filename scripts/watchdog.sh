#!/bin/bash
# Watchdog script that keeps the dev server running
cd /home/z/my-project

while true; do
  # Check if next dev is running
  if ! pgrep -f "next dev" > /dev/null 2>&1; then
    echo "[$(date)] Starting dev server..."
    node_modules/.bin/next dev -p 3000 > dev.log 2>&1 &
    SERVER_PID=$!
    echo "[$(date)] Dev server started with PID $SERVER_PID"
    # Wait for it to be ready
    sleep 8
  fi
  # Sleep before checking again
  sleep 30
done
