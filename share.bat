@echo off
setlocal

echo =======================================================
echo    AlgoScan / StockAI Pulse - Public Sharing Tunnel
echo =======================================================
echo.
echo Choose your sharing method:
echo   [1] Cloudflare Tunnel (Recommended - Instant HTTPS, No Passwords, Fast)
echo   [2] Localtunnel (via Node.js)
echo   [3] Ngrok
echo.

set /p choice="Enter choice (1, 2, or 3, default is 1): "
if "%choice%"=="" set choice=1

if "%choice%"=="1" (
    echo.
    echo Starting Cloudflare Tunnel for http://127.0.0.1:5173...
    echo.
    echo Look for the URL ending with ".trycloudflare.com" below:
    echo =======================================================
    echo.
    if exist "%~dp0cloudflared.exe" (
        "%~dp0cloudflared.exe" tunnel --url http://127.0.0.1:5173
    ) else (
        cloudflared tunnel --url http://127.0.0.1:5173
    )
    goto :EOF
)

if "%choice%"=="2" (
    echo.
    echo Starting Localtunnel on 127.0.0.1:5173...
    npx localtunnel --port 5173 --local-host 127.0.0.1
    goto :EOF
)

if "%choice%"=="3" (
    echo.
    echo Starting Ngrok on port 5173...
    set "NGROK_EXE=ngrok"
    where ngrok >nul 2>&1
    if %errorlevel% neq 0 (
        if exist "%LOCALAPPDATA%\Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\ngrok.exe" (
            set "NGROK_EXE=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\ngrok.exe"
        )
    )
    "%NGROK_EXE%" http 5173
    goto :EOF
)

pause
