# Upload to GitHub - Interactive Script

Write-Host "`n=== GITHUB UPLOAD ASSISTANT ===" -ForegroundColor Cyan
Write-Host "`nThis will help you upload your code to GitHub" -ForegroundColor Yellow

# Get GitHub username
Write-Host "`nStep 1: Enter your GitHub username" -ForegroundColor Cyan
$username = Read-Host "GitHub username"

if (-not $username) {
    Write-Host "❌ Username required!" -ForegroundColor Red
    exit
}

# Get repository name
Write-Host "`nStep 2: Enter repository name (or press Enter for 'library-kosovo')" -ForegroundColor Cyan
$repoName = Read-Host "Repository name [library-kosovo]"
if (-not $repoName) {
    $repoName = "library-kosovo"
}

$repoUrl = "https://github.com/$username/$repoName.git"

Write-Host "`n=== CONFIGURATION ===" -ForegroundColor Yellow
Write-Host "Username: $username" -ForegroundColor White
Write-Host "Repository: $repoName" -ForegroundColor White
Write-Host "URL: $repoUrl" -ForegroundColor White

Write-Host "`n⚠️  IMPORTANT: Have you created the repository on GitHub?" -ForegroundColor Yellow
Write-Host "   1. Go to https://github.com/new" -ForegroundColor White
Write-Host "   2. Repository name: $repoName" -ForegroundColor White
Write-Host "   3. Choose Public or Private" -ForegroundColor White
Write-Host "   4. DON'T check 'Add README'" -ForegroundColor White
Write-Host "   5. Click 'Create repository'" -ForegroundColor White

$ready = Read-Host "`nHave you created the repository on GitHub? (yes/no)"

if ($ready -ne "yes" -and $ready -ne "y") {
    Write-Host "`n⏸️  Please create the repository first, then run this script again." -ForegroundColor Yellow
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

Write-Host "`n=== UPLOADING TO GITHUB ===" -ForegroundColor Cyan

# Remove existing remote if any
Write-Host "`n1. Configuring remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin $repoUrl

if ($?) {
    Write-Host "   ✅ Remote configured" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Remote configuration issue (continuing...)" -ForegroundColor Yellow
}

# Push to GitHub
Write-Host "`n2. Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "   (You may need to enter your GitHub credentials)" -ForegroundColor Gray

git push -u origin main

if ($?) {
    Write-Host "`n=== SUCCESS! ===" -ForegroundColor Green
    Write-Host "✅ Code uploaded to GitHub!" -ForegroundColor Green
    Write-Host "`nYour repository: https://github.com/$username/$repoName" -ForegroundColor Cyan
    Write-Host "`nYou can now:" -ForegroundColor Yellow
    Write-Host "  • Share the repository link" -ForegroundColor White
    Write-Host "  • Clone it on other computers" -ForegroundColor White
    Write-Host "  • Collaborate with others" -ForegroundColor White
    
    # Open repository in browser
    $openBrowser = Read-Host "`nOpen repository in browser? (yes/no)"
    if ($openBrowser -eq "yes" -or $openBrowser -eq "y") {
        Start-Process "https://github.com/$username/$repoName"
    }
} else {
    Write-Host "`n❌ Upload failed!" -ForegroundColor Red
    Write-Host "`nPossible issues:" -ForegroundColor Yellow
    Write-Host "  • Repository doesn't exist on GitHub" -ForegroundColor White
    Write-Host "  • Wrong credentials" -ForegroundColor White
    Write-Host "  • Need Personal Access Token (not password)" -ForegroundColor White
    Write-Host "`nTo create a token:" -ForegroundColor Cyan
    Write-Host "  1. Go to: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "  2. Generate new token (classic)" -ForegroundColor White
    Write-Host "  3. Select 'repo' scope" -ForegroundColor White
    Write-Host "  4. Use token as password" -ForegroundColor White
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

