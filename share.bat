@echo off
setlocal

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0share.ps1"
pause
