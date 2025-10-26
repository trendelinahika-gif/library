# National Library of Kosovo - Startup Script
# This script starts both backend and frontend servers

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  National Library of Kosovo - Web Application" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "[WARNING] Frontend dependencies not found. Installing..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "backend/node_modules")) {
    Write-Host "[WARNING] Backend dependencies not found. Installing..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

Write-Host ""
Write-Host "[STARTING] Launching servers..." -ForegroundColor Cyan
Write-Host ""

# Kill any existing Node processes on ports 3000 and 5000
Write-Host "Checking for existing processes..." -ForegroundColor Yellow
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue

if ($port3000) {
    $pid3000 = $port3000.OwningProcess
    Stop-Process -Id $pid3000 -Force -ErrorAction SilentlyContinue
    Write-Host "Stopped process on port 3000" -ForegroundColor Yellow
}

if ($port5000) {
    $pid5000 = $port5000.OwningProcess
    Stop-Process -Id $pid5000 -Force -ErrorAction SilentlyContinue
    Write-Host "Stopped process on port 5000" -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

# Start Backend Server
Write-Host "[BACKEND] Starting Backend Server (Port 5000)..." -ForegroundColor Green
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend Server Starting...' -ForegroundColor Cyan; node server.js"

# Wait for backend to start
Write-Host "[WAIT] Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Frontend Server
Write-Host "[FRONTEND] Starting Frontend Server (Port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host 'Frontend Server Starting...' -ForegroundColor Cyan; npm run dev"

# Wait for frontend to start
Write-Host "[WAIT] Waiting for frontend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  Application Started Successfully!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "Notes:" -ForegroundColor Cyan
Write-Host "   - Two PowerShell windows will open (one for each server)" -ForegroundColor White
Write-Host "   - Keep both windows open while using the application" -ForegroundColor White
Write-Host "   - Press Ctrl+C in each window to stop the servers" -ForegroundColor White
Write-Host ""

# Open browser
Write-Host "[BROWSER] Opening browser..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "Enjoy using the National Library of Kosovo platform!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit this window (servers will continue running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
