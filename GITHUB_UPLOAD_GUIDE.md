# 📤 How to Upload to GitHub

## ✅ Git Setup Complete!

Your project is now ready to upload to GitHub!

---

## 🚀 Step-by-Step GitHub Upload

### Step 1: Create GitHub Repository

1. Go to **https://github.com**
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name:** `library-kosovo` (or any name you want)
   - **Description:** "National Library of Kosovo - Web Application"
   - **Visibility:** 
     - ✅ **Public** (if you want others to see it)
     - ✅ **Private** (if you want to keep it private)
   - ❌ **DON'T** check "Add README" (we already have code)
4. Click **"Create repository"**

---

### Step 2: Connect Your Local Project to GitHub

GitHub will show you commands. **Don't use those!** Use these instead:

```powershell
# Add your GitHub repository (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/library-kosovo.git

# Push your code to GitHub
git push -u origin main
```

**Example:**
```powershell
# If your GitHub username is "eriksmith"
git remote add origin https://github.com/eriksmith/library-kosovo.git
git push -u origin main
```

---

### Step 3: Enter GitHub Credentials

When you run `git push`, GitHub will ask for credentials:

**Option A: Personal Access Token (Recommended)**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: "Library Kosovo"
4. Expiration: Choose how long
5. Select scopes: ✅ **repo** (all options under repo)
6. Click "Generate token"
7. **Copy the token** (you won't see it again!)
8. When prompted for password, **paste the token**

**Option B: GitHub CLI (Easier)**
```powershell
# Install GitHub CLI first (if not installed)
winget install GitHub.cli

# Login to GitHub
gh auth login

# Follow the prompts
```

---

## 📦 What Gets Uploaded

### ✅ Included (Will be uploaded):
- All source code (`src/` folder)
- Backend code (`backend/` folder)
- Configuration files
- Package files
- README and documentation
- All components and pages

### ❌ Excluded (Won't be uploaded):
- `node_modules/` - Too large, can be reinstalled
- `.next/` - Build cache, regenerates automatically
- `.env` files - Sensitive data, kept secret
- Logs and temporary files

**Total size:** ~10-20 MB (without node_modules)

---

## 🔄 Future Updates

### To Upload Changes Later:

```powershell
# Save your changes
git add .
git commit -m "Description of what you changed"
git push
```

**Examples:**
```powershell
# After adding a new feature
git add .
git commit -m "Added user dashboard feature"
git push

# After fixing a bug
git add .
git commit -m "Fixed login authentication bug"
git push

# After updating design
git add .
git commit -m "Updated homepage design"
git push
```

---

## 📂 Large Files (If Needed)

If you have large files (>100MB), use **Git LFS**:

### Install Git LFS:
```powershell
# Install
git lfs install

# Track large file types
git lfs track "*.zip"
git lfs track "*.mp4"
git lfs track "*.pdf"

# Commit and push
git add .gitattributes
git commit -m "Add Git LFS tracking"
git push
```

---

## 🌐 Your Repository URL

After uploading, your repository will be at:
```
https://github.com/YOUR_USERNAME/library-kosovo
```

You can:
- Share this link with others
- Clone it on other computers
- Collaborate with team members
- Show it in your portfolio

---

## 👥 Making it Team-Accessible

### Add Collaborators:
1. Go to your repository on GitHub
2. Click **"Settings"** → **"Collaborators"**
3. Click **"Add people"**
4. Enter their GitHub username
5. They can now push code too!

---

## 🔒 Keeping Sensitive Data Safe

**Already Protected:** Your `.env` files with passwords/API keys are in `.gitignore` and won't be uploaded.

**To Share Settings:** Use the `.env.example` files:
```powershell
# These are safe to upload and included in the repository
backend/.env.example
.env.local (would be .env.example if you create it)
```

---

## ✅ Complete Workflow

### Initial Upload (Do Once):
```powershell
# 1. Create repo on GitHub
# 2. Connect and push
git remote add origin https://github.com/USERNAME/library-kosovo.git
git push -u origin main
```

### Regular Updates (Do Often):
```powershell
git add .
git commit -m "Your change description"
git push
```

### Clone on Another Computer:
```powershell
git clone https://github.com/USERNAME/library-kosovo.git
cd library-kosovo
npm install
cd backend
npm install
cd ..
.\start-app.ps1
```

---

## 🆘 Troubleshooting

### "Remote already exists"
```powershell
# Remove old remote and add new one
git remote remove origin
git remote add origin https://github.com/USERNAME/library-kosovo.git
```

### "Authentication failed"
- Use Personal Access Token (not password)
- Token must have "repo" permissions
- Generate new token if old one expired

### "Large files detected"
```powershell
# Use Git LFS for files over 100MB
git lfs install
git lfs track "*.large-file-type"
git add .gitattributes
git commit -m "Add LFS tracking"
git push
```

### "Permission denied"
- Make sure you own the repository
- Or that you've been added as a collaborator

---

## 🎯 Quick Reference

```powershell
# View status
git status

# View history
git log --oneline

# View remote
git remote -v

# Push changes
git push

# Pull changes
git pull

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main
```

---

## 📞 Ready to Upload!

**Your Git repository is set up!** 

**Next Steps:**
1. ✅ Create repository on GitHub.com
2. ✅ Run the `git remote add` command (with YOUR username)
3. ✅ Run `git push -u origin main`
4. ✅ Done! Your code is on GitHub!

---

**Your project is ready for GitHub! 🎉**

