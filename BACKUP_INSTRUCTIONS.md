# 📦 How to Backup Your Working Application

## Method 1: Quick ZIP Backup (Recommended)

### Create a Backup ZIP File:
```powershell
# Navigate to parent directory
cd ..

# Create timestamped backup
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$backupName = "library-backup-$timestamp"
Compress-Archive -Path "new library web" -DestinationPath "$backupName.zip"

Write-Host "✅ Backup created: $backupName.zip" -ForegroundColor Green
```

This creates a ZIP file with timestamp like: `library-backup-2024-10-26_14-30.zip`

---

## Method 2: Copy to Backup Folder

### Create a Full Copy:
```powershell
# Navigate to parent directory
cd ..

# Create backup folder with timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$backupFolder = "library-backup-$timestamp"

# Copy entire project
Copy-Item -Path "new library web" -Destination $backupFolder -Recurse

Write-Host "✅ Backup created in folder: $backupFolder" -ForegroundColor Green
```

---

## Method 3: Git Version Control (Best for Long-term)

### Initialize Git Repository:
```powershell
# Navigate to your project
cd "new library web"

# Initialize git (if not already done)
git init

# Create .gitignore file
@"
node_modules/
.next/
.env
.env.local
backend/.env
backend/node_modules/
*.log
.DS_Store
"@ | Out-File -FilePath .gitignore -Encoding utf8

# Add all files
git add .

# Create first commit (snapshot)
git commit -m "Working version - All features restored and functional"

Write-Host "✅ Git repository created with commit!" -ForegroundColor Green
```

### Create Future Backups with Git:
```powershell
# Save current state
git add .
git commit -m "Description of changes"
```

### Restore from Git:
```powershell
# See all saved versions
git log

# Go back to specific version
git checkout <commit-hash>
```

---

## Method 4: Cloud Backup (GitHub/GitLab)

### Push to GitHub:
```powershell
# Create repository on GitHub first, then:
git remote add origin https://github.com/yourusername/library-kosovo.git
git branch -M main
git push -u origin main
```

---

## 🚀 Quick Backup Script

Save this as `create-backup.ps1`:

```powershell
# Quick Backup Script for National Library Kosovo

Write-Host "`n=== LIBRARY BACKUP UTILITY ===" -ForegroundColor Cyan
Write-Host "Creating backup of your working application..." -ForegroundColor Yellow

# Get timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupName = "library-backup-$timestamp"

# Navigate to parent directory
$currentDir = Get-Location
cd ..

# Create ZIP backup
Write-Host "`nCompressing files..." -ForegroundColor Yellow
Compress-Archive -Path "new library web" -DestinationPath "$backupName.zip" -Force

$backupPath = Join-Path (Get-Location) "$backupName.zip"
$backupSize = (Get-Item $backupPath).Length / 1MB

Write-Host "`n✅ BACKUP COMPLETE!" -ForegroundColor Green
Write-Host "Location: $backupPath" -ForegroundColor White
Write-Host "Size: $([math]::Round($backupSize, 2)) MB" -ForegroundColor White
Write-Host "`nTo restore: Extract this ZIP file" -ForegroundColor Cyan

# Return to original directory
cd $currentDir
```

### Use the Script:
```powershell
.\create-backup.ps1
```

---

## 📂 What Gets Backed Up

Your backup includes:
- ✅ All source code (`src/` folder)
- ✅ All components
- ✅ Backend code and models
- ✅ Configuration files
- ✅ Package files (package.json)
- ✅ Environment examples
- ❌ node_modules (excluded - can reinstall)
- ❌ .next cache (excluded - rebuilds automatically)

---

## 🔄 How to Restore from Backup

### From ZIP File:
```powershell
# Extract the ZIP
Expand-Archive -Path "library-backup-2024-10-26_14-30.zip" -DestinationPath "restored-library"

# Navigate to restored folder
cd restored-library

# Reinstall dependencies
npm install
cd backend
npm install
cd ..

# Start servers
.\start-app.ps1
```

### From Git:
```powershell
# Clone or restore
git clone <repository-url>
cd library-kosovo

# Install dependencies
npm install
cd backend
npm install
cd ..

# Start servers
.\start-app.ps1
```

---

## 📝 Recommended Backup Schedule

### Daily Development:
```powershell
# Quick backup before making changes
.\create-backup.ps1
```

### After Major Changes:
```powershell
# Git commit
git add .
git commit -m "Added new feature X"
```

### Weekly/Monthly:
```powershell
# Full backup to external drive or cloud
.\create-backup.ps1
# Copy resulting ZIP to external storage
```

---

## 🛡️ Backup Best Practices

1. **Before Major Changes** - Always backup before adding new features
2. **Multiple Locations** - Keep backups in different places
3. **Test Restores** - Occasionally test that backups work
4. **Document Changes** - Note what works in each backup
5. **Clean Backups** - Delete old backups to save space

---

## 💾 Backup Storage Options

### Local Storage:
- External hard drive
- USB flash drive
- Network drive

### Cloud Storage:
- GitHub (free for public/private repos)
- GitLab (free unlimited private repos)
- Google Drive
- Dropbox
- OneDrive

---

## ⚠️ Important Files to Protect

Make sure these are in your backup:
- ✅ `src/` - All your code
- ✅ `backend/` - API and models
- ✅ `package.json` - Dependencies
- ✅ Configuration files
- ✅ `.env.example` - Template
- ❌ `.env` - Keep separate/secure (passwords)

---

## 🎯 Quick Commands Reference

```powershell
# Create ZIP backup
Compress-Archive -Path "new library web" -DestinationPath "backup.zip"

# Create folder copy
Copy-Item -Path "new library web" -Destination "backup-folder" -Recurse

# Git commit
git add .
git commit -m "Working version"

# Git push to remote
git push origin main
```

---

## 📞 Need Help?

If backup fails:
1. Check disk space: `Get-PSDrive C`
2. Check folder permissions
3. Close all files/editors
4. Try as Administrator

---

**Your working application is now safe to backup! 📦✅**

