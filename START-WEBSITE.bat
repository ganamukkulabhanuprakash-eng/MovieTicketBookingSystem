@echo off
cd /d "%~dp0"
title CineVault - Full Stack Launcher
echo ===================================================
echo           CineVault Movie Ticket System
echo ===================================================
echo.
echo 1. Starting Backend...
start "CineVault Backend" cmd /k "cd /d ""%~dp0backend"" && java -jar target\cinevault-backend-1.0.0.jar"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo 2. Starting Frontend...
start "CineVault Frontend" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo Opening website in browser...
timeout /t 3 /nobreak > nul
start http://localhost:5173
