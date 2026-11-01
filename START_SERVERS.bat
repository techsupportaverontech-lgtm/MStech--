@echo off
title MS Technologies - Servers
echo Starting MS Technologies servers...
echo.

:: Start Backend API on port 4000
start "MS Tech Backend (Port 4000)" cmd /k "cd /d "c:\Users\User\Desktop\MS technologies" && echo Starting Backend... && node server/index.js"

timeout /t 3 /nobreak >nul

:: Start Frontend on port 3000
start "MS Tech Frontend (Port 3000)" cmd /k "cd /d "c:\Users\User\Desktop\MS technologies" && echo Starting Frontend... && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo - Backend:  http://localhost:4000
echo - Frontend: http://localhost:3000
echo.
echo DO NOT close those two windows while using the site.
pause
