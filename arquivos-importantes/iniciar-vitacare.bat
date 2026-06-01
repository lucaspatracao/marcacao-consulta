@echo off
title VitaCare - Node-RED
cd /d "%~dp0"

REM Garante Node.js no PATH (instalacao recente ou terminal antigo)
if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%PATH%"

where node >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERRO: Node.js nao encontrado neste PC.
    echo Instale em https://nodejs.org/ ^(versao LTS^) e abra de novo este arquivo.
    echo.
    pause
    exit /b 1
)

echo Parando instancias antigas na porta 1880...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 1880 -State Listen -EA SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -EA SilentlyContinue }"
timeout /t 2 /nobreak >nul

if not exist "%~dp0node_modules\node-red" (
    echo Instalando dependencias ^(primeira vez, pode demorar^)...
    call npm install
    if errorlevel 1 (
        echo Falha no npm install.
        pause
        exit /b 1
    )
)

echo.
echo Site:    http://127.0.0.1:1880/
echo Admin:   http://127.0.0.1:1880/admin/
echo.
echo Para usar em outro PC, copie esta pasta .node-red — veja SYNC-ENTRE-PCS.md
echo.

call npm start

echo.
echo Node-RED encerrado.
pause
