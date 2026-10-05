@echo off
cd /d "%~dp0"
title CineVault - Full Stack Launcher
echo ===================================================
echo           CineVault Movie Ticket System
echo ===================================================
echo.
echo Starting Spring Boot Backend (Port 8080)...
start "CineVault Backend (8080)" cmd /k "cd /d ""%~dp0backend"" && java -jar target\cinevault-backend-1.0.0.jar"

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

echo Starting React Frontend (Port 5173)...
start "CineVault Frontend (5173)" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo ===================================================
echo Applications launched!
echo - Customer Website: http://localhost:5173
echo - Backend API:      http://localhost:8080
echo ===================================================
timeout /t 3 /nobreak > nul
start http://localhost:5173
