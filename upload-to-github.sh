#!/usr/bin/env bash
cd "$(dirname "$0")"

echo "========================================================"
echo "  Denim Universe - Upload to GitHub"
echo "  Target: https://github.com/asifjahandesh/denimuniverse"
echo "========================================================"
echo ""

echo "1. Initializing Git repository..."
git init
echo ""

echo "2. Staging files..."
git add .
echo ""

echo "3. Creating initial commit..."
git commit -m "feat: initial commit with official logo, SVG icon, and denim knowledge platform"
git branch -M main
echo ""

echo "4. Setting remote origin..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/asifjahandesh/denimuniverse.git
echo ""

echo "5. Pushing to GitHub..."
git push -u origin main

echo ""
echo "========================================================"
echo "  Done! Check: https://github.com/asifjahandesh/denimuniverse"
echo "========================================================"