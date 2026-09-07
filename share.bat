@echo off
setlocal

echo =======================================================
echo    AlgoScan / StockAI Pulse - Public Sharing Tunnel
echo =======================================================
echo.
echo Choose your tunnel method:
echo   [1] Cloudflare Tunnel (Requires Chrome Secure DNS in India)
echo   [2] Localtunnel (Works on Indian ISPs without DNS changes)
echo.

set /p choice="Enter choice (1 or 2, default is 2): "
if "%choice%"=="" set choice=2

if "%choice%"=="1" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0share.ps1"
    goto :EOF
)

if "%choice%"=="2" (
    echo.
    echo Starting Localtunnel...
    echo Share the URL shown below with anyone!
    echo.
    npx localtunnel --port 5173 --local-host 127.0.0.1
    goto :EOF
)

pause
