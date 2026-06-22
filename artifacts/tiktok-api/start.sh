#!/bin/bash
set -e

echo "Installing Python dependencies..."
pip install -r requirements.txt -q

echo "Starting yt-dlp auto-updater in background..."
python updater.py &

echo "Starting FastAPI server on port $PORT..."
python main.py
