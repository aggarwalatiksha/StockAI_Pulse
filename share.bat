@echo off
setlocal

echo =========================================
echo    AlgoScan / StockAI Pulse - Ngrok
echo =========================================
echo.

set "NGROK_EXE=ngrok"
where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    if exist "%LOCALAPPDATA%\Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\ngrok.exe" (
        set "NGROK_EXE=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\ngrok.exe"
    )
)

echo Starting public HTTPS tunnel for port 5173 (Frontend + Backend API)...
echo.
echo =========================================================================
echo   Share the "Forwarding" https://...ngrok-free.app URL with anyone!
echo   Keep this window and your start.bat windows open.
echo =========================================================================
echo.

"%NGROK_EXE%" http 5173
pause
