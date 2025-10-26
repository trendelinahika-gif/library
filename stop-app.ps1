# National Library of Kosovo - Stop Script
# This script stops all running servers

Write-Host "================================================" -ForegroundColor Red
Write-Host "  Stopping National Library Application" -ForegroundColor Red
Write-Host "================================================" -ForegroundColor Red
Write-Host ""

# Stop processes on port 3000 (Frontend)
Write-Host "Stopping Frontend Server (Port 3000)..." -ForegroundColor Yellow
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    $pid3000 = $port3000.OwningProcess
    Stop-Process -Id $pid3000 -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Frontend server stopped" -ForegroundColor Green
} else {
    Write-Host "ℹ No process found on port 3000" -ForegroundColor Gray
}

# Stop processes on port 5000 (Backend)
Write-Host "Stopping Backend Server (Port 5000)..." -ForegroundColor Yellow
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($port5000) {
    $pid5000 = $port5000.OwningProcess
    Stop-Process -Id $pid5000 -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Backend server stopped" -ForegroundColor Green
} else {
    Write-Host "ℹ No process found on port 5000" -ForegroundColor Gray
}

# Stop any remaining node processes (optional, commented out for safety)
# Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host ""
Write-Host "✓ All servers stopped successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

