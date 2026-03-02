@echo off
REM EDIZO Admin Panel - Quick Deploy Script for Netlify (Windows)
REM Usage: deploy.bat

echo.
echo ==========================================
echo   EDIZO Admin Panel - Netlify Deployment
echo ==========================================
echo.

REM Check if Netlify CLI is installed
where netlify >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Netlify CLI is not installed.
    echo Install it with: npm install -g netlify-cli
    echo.
    pause
    exit /b 1
)

REM Check if logged in
echo Checking Netlify login status...
netlify status >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Please login to Netlify...
    netlify login
)

REM Change to admin directory
cd /d "%~dp0"

REM Check if .env exists
if not exist .env (
    echo [WARNING] .env file not found!
    echo Creating from .env.example...
    copy .env.example .env
    echo.
    echo Please edit .env and set VITE_API_URL to your backend URL
    echo Example: VITE_API_URL=https://your-backend.onrender.com/api
    echo.
    pause
)

echo.
echo Building admin panel...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Build failed! Please check for errors above.
    pause
    exit /b 1
)

echo.
echo Build successful!
echo.
echo Deploying to Netlify...
netlify deploy --prod --dir=dist

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==========================================
    echo   Deployment successful!
    echo ==========================================
    echo.
    echo Your site is live at:
    netlify open
) else (
    echo.
    echo [ERROR] Deployment failed! Please check the errors above.
)

echo.
pause
