@echo off
cd /d "%~dp0"
echo ========================================================
echo   Denim Universe - Push Updates to GitHub
echo   Target: https://github.com/asifjahandesh/denimuniverse
echo ========================================================
echo.
echo Checking changed files:
git status -s
echo.
set /p MSG="Enter commit message (press Enter for 'feat: add automated welcome email serverless function via Resend'): "
if "%MSG%"=="" set MSG=feat: add automated welcome email serverless function via Resend

echo.
echo 1. Staging changes...
git add .

echo.
echo 2. Committing changes...
git commit -m "%MSG%"

echo.
echo 3. Pushing to GitHub...
git push origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo   SUCCESS: Changes are now live on GitHub!
    echo   https://github.com/asifjahandesh/denimuniverse
    echo ========================================================
) else (
    echo ========================================================
    echo   Push encountered an error. If remote has new commits,
    echo   run:
    echo     git pull origin main --rebase
    echo     git push origin main
    echo ========================================================
)
echo.
pause