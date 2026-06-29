#!/bin/bash
set -e

echo "==> Installing Node packages..."
pnpm install --frozen-lockfile

echo "==> Post-merge setup complete."
