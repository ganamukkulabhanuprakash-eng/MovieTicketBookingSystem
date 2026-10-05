@echo off
title CineVault - Stopper
echo Stopping CineVault Backend (port 8080) and Frontend (port 5173)...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do (
    echo Stopping Backend PID: %%a
    taskkill /f /pid %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo Stopping Frontend PID: %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo Done! CineVault services stopped.
timeout /t 2 >nul
