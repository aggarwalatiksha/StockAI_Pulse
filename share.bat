@echo off
setlocal

echo =======================================================
echo    AlgoScan / StockAI Pulse - Public Sharing Tunnel
echo =======================================================
echo.
echo Choose your preferred tunnel method:
echo   [1] Localtunnel (Recommended - Instant, No Account, No Antivirus Issues)
echo   [2] Ngrok (Requires Ngrok Account & Unblocked Antivirus)
echo.

set /p choice="Enter choice (1 or 2, default is 1): "
if "%choice%"=="" set choice=1

if "%choice%"=="1" (
    echo.
    echo Starting Localtunnel on port 5173...
    echo Share the URL shown below with anyone!
    echo.
    npx localtunnel --port 5173
    goto :EOF
)

if "%choice%"=="2" (
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
