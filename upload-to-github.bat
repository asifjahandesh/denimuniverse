@echo off
cd /d "%~dp0"
echo ========================================================
echo   Denim Universe - Upload to GitHub
echo   Target: https://github.com/asifjahandesh/denimuniverse
echo ========================================================
echo.
echo 1. Initializing Git repository...
git init
echo.
echo 2. Staging files...
git add .
echo.
echo 3. Creating initial commit...
git commit -m "feat: initial commit with official logo, SVG icon, and denim knowledge platform"
git branch -M main
echo.
echo 4. Setting remote origin...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/asifjahandesh/denimuniverse.git
echo.
echo 5. Pushing to GitHub...
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo   SUCCESS: Denim Universe is now live on GitHub!
    echo   https://github.com/asifjahandesh/denimuniverse
    echo ========================================================
) else (
    echo ========================================================
    echo   If the push failed because the repo already has files,
    echo   try pulling first or force pushing:
    echo     git push -u origin main --force
    echo ========================================================
)
echo.
pause