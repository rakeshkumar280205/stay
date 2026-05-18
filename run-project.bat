@echo off
REM StayEase Project Startup Script - With Tailwind CSS Fix
REM This script starts both the backend and frontend servers

echo.
echo ========================================
echo   Starting StayEase Project
echo ========================================
echo.

REM Kill any existing node processes
echo Cleaning up old processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak

REM Start Backend Server in a new window
echo Starting Backend Server on port 5000...
cd /d "%~dp0backend"
start "Backend - StayEase" cmd /k "npm run dev"

REM Wait for backend to fully start
timeout /t 4 /nobreak

REM Start Frontend Server in a new window
echo Starting Frontend Server on port 5173...
cd /d "%~dp0frontend"
start "Frontend - StayEase" cmd /k "npm run dev"

REM Go back to original directory
cd /d "%~dp0"

echo.
echo ========================================
echo   ✅ Project Started Successfully!
echo ========================================
echo.
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:5173
echo            (Falls back to 5174 if port busy)
echo.
echo   IMPORTANT: 
echo   - Wait 5-10 seconds for Tailwind CSS to compile
echo   - Check both terminal windows for any errors
echo   - Refresh the page if styles don't appear
echo.
echo   To stop: Close the terminal windows
echo ========================================
echo.
pause



