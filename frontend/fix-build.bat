@echo off
REM Frontend Build Fix for Windows - "Too Many Open Files" Error
REM This script increases Node memory and reduces file operations

echo.
echo ==========================================
echo   Frontend Build Fix - Windows
echo ==========================================
echo.

echo [1/3] Setting environment variables...
set NODE_OPTIONS=--max-old-space-size=4096
set VITE_BUILD_CONCURRENCY=1
set MAX_PARALLEL_FILE_OPS=10

echo [2/3] Cleaning cache...
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist dist rmdir /s /q dist

echo [3/3] Building with increased memory limit...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==========================================
    echo   Build successful!
    echo ==========================================
    echo.
) else (
    echo.
    echo ==========================================
    echo   Build failed. Trying alternative method...
    echo ==========================================
    echo.
    
    echo Trying direct build with max memory...
    node --max-old-space-size=8192 node_modules/vite/bin/vite.js build
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ==========================================
        echo   Build successful!
        echo ==========================================
        echo.
    ) else (
        echo.
        echo ==========================================
        echo   Build still failed. Try these:
        echo   1. Restart your computer
        echo   2. Close all unnecessary applications
        echo   3. Use WSL2 for development
        echo   4. Check FIX_BUILD.md for more solutions
        echo ==========================================
        echo.
    )
)

pause
