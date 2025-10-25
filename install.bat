@echo off
echo Installing Cute Mimo Desktop Companion...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo Installing dependencies...
npm install

echo.
echo Building the application...
npm run build

echo.
echo Installation complete!
echo You can now run Cute Mimo with: npm start
echo Or build a distributable with: npm run dist
echo.
pause