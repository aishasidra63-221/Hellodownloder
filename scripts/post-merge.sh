#!/bin/bash
set -e

echo "==> Installing Node packages..."
pnpm install --frozen-lockfile

echo "==> Installing Python packages..."
uv pip install -r artifacts/tiktok-api/requirements.txt -q

echo "==> Post-merge setup complete."
