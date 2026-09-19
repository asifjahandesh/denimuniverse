@echo off
cd /d "%~dp0"
echo ========================================================
echo   Denim Universe - Installing Supabase Client
echo ========================================================
echo.
call npm install
echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo   SUCCESS: Supabase dependencies installed!
    echo ========================================================
) else (
    echo ========================================================
    echo   ERROR: Installation encountered an issue.
    echo ========================================================
)
echo.
pause
