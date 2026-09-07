@echo off
setlocal

echo =========================================
echo       AlgoScan / StockAI Pulse
echo =========================================

:: Check if Docker is running
docker info >nul 2>&1
if %errorlevel% equ 0 (
    echo Docker is running.
    set /p use_docker="Do you want to run with Docker Compose? (y/n): "
    if /i "%use_docker%"=="y" (
        echo Starting Docker Compose...
        docker compose up --build
        goto :EOF
    )
) else (
    echo Docker is not running or not installed. Falling back to local setup.
)

:: Check if .env exists
if not exist "backend\.env" (
    if exist "backend\.env.example" (
        echo Copying backend\.env.example to backend\.env
        copy "backend\.env.example" "backend\.env"
    )
)

echo Starting Backend...
start "AlgoScan Backend" cmd /c "cd backend && C:\Users\DELL\AppData\Local\Programs\Python\Python311\python.exe -m uvicorn app.main:app --reload --port 8000"

echo Starting Frontend...
start "AlgoScan Frontend" cmd /c "cd frontend && npm run dev"

echo Waiting for services to initialize...
timeout /t 8 /nobreak >nul

echo Opening browser...
start http://localhost:5173

echo Done! Keep the backend and frontend command windows open.
pause
