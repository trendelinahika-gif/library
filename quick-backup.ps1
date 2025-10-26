# Quick Backup - Simpler version using robocopy

Write-Host "`n=== QUICK BACKUP ===" -ForegroundColor Cyan

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupFolder = "..\library-backup-$timestamp"

Write-Host "Creating backup folder..." -ForegroundColor Yellow

# Use robocopy to copy files (faster and excludes locked files)
robocopy . $backupFolder /E /XD node_modules .next .git /XF *.log /NFL /NDL /NJH /NJS

if ($LASTEXITCODE -le 7) {
    Write-Host "`n✅ BACKUP COMPLETE!" -ForegroundColor Green
    Write-Host "Location: $((Get-Item $backupFolder).FullName)" -ForegroundColor White
    $size = (Get-ChildItem $backupFolder -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "Size: $([math]::Round($size, 2)) MB" -ForegroundColor White
} else {
    Write-Host "`n❌ Backup had errors" -ForegroundColor Red
}

