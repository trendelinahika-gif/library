# National Library of Kosovo - Backup Script
# This script creates a clean backup excluding temporary files

Write-Host "`n=== LIBRARY BACKUP UTILITY ===" -ForegroundColor Cyan
Write-Host "Creating backup of your working application..." -ForegroundColor Yellow

# Get timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupName = "library-backup-$timestamp"
$tempFolder = "temp-backup-$timestamp"

try {
    # Navigate to parent directory
    cd ..
    
    Write-Host "`nCopying files (excluding node_modules and .next)..." -ForegroundColor Yellow
    
    # Create temp folder
    New-Item -ItemType Directory -Path $tempFolder -Force | Out-Null
    
    # Copy files excluding unnecessary folders
    $excludeFolders = @('node_modules', '.next', '.git')
    
    Get-ChildItem -Path "new library web" -Recurse | Where-Object {
        $path = $_.FullName
        $exclude = $false
        foreach ($folder in $excludeFolders) {
            if ($path -like "*\$folder\*" -or $path -like "*\$folder") {
                $exclude = $true
                break
            }
        }
        -not $exclude
    } | ForEach-Object {
        $relativePath = $_.FullName.Replace((Get-Item "new library web").FullName, "")
        $destPath = Join-Path $tempFolder $relativePath
        $destDir = Split-Path $destPath -Parent
        
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        
        if (-not $_.PSIsContainer) {
            Copy-Item $_.FullName -Destination $destPath -Force
        }
    }
    
    Write-Host "Compressing backup..." -ForegroundColor Yellow
    Compress-Archive -Path $tempFolder -DestinationPath "$backupName.zip" -Force
    
    # Clean up temp folder
    Remove-Item -Recurse -Force $tempFolder
    
    # Get backup details
    $backupPath = Join-Path (Get-Location) "$backupName.zip"
    $backupSize = (Get-Item $backupPath).Length / 1MB
    
    Write-Host "`n=== BACKUP COMPLETE ===" -ForegroundColor Green
    Write-Host "File: $backupName.zip" -ForegroundColor White
    Write-Host "Location: $backupPath" -ForegroundColor White
    Write-Host "Size: $([math]::Round($backupSize, 2)) MB" -ForegroundColor White
    Write-Host "`n✅ Your working application is backed up!" -ForegroundColor Green
    Write-Host "`nTo restore:" -ForegroundColor Cyan
    Write-Host "  1. Extract the ZIP file" -ForegroundColor White
    Write-Host "  2. Run: npm install" -ForegroundColor White
    Write-Host "  3. Run: cd backend && npm install" -ForegroundColor White
    Write-Host "  4. Run: .\start-app.ps1" -ForegroundColor White
    
} catch {
    Write-Host "`n❌ Backup failed: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    # Return to original directory
    cd "new library web"
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

