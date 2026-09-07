@echo off
setlocal

echo =========================================
echo    AlgoScan / StockAI Pulse - Ngrok
echo =========================================
echo.

:: Check if ngrok is accessible
where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    set "PATH=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe;%PATH%"
)

echo Starting public HTTPS tunnel for port 5173 (Frontend + Backend API)...
echo.
echo =========================================================================
echo   Share the "Forwarding" https://...ngrok-free.app URL with anyone!
echo   Keep this window and your start.bat windows open.
echo =========================================================================
echo.

ngrok http 5173
pause
