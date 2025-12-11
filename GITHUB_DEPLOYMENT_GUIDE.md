# 🚀 Deploy Project to GitHub - Complete Guide

## 📋 Prerequisites

- Git installed on your system
- GitHub account created
- GitHub Personal Access Token (for authentication)

## 🔧 Step 1: Initialize Git Repository

```powershell
# Navigate to project directory
cd "C:\Users\Gulshan Bhati\OneDrive\Documents\ibm\devops-todo-app"

# Initialize git repository
git init

# Verify git is initialized
git status
```

## 📝 Step 2: Configure Git (If Not Already Done)

```powershell
# Set your name and email (use your GitHub credentials)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

## 📦 Step 3: Check .gitignore File

Make sure `.gitignore` exists and includes:

```
# Dependencies
node_modules/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python

# Environment variables
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Build outputs
build/
dist/
*.egg-info/

# Docker
.dockerignore

# Database
*.db
*.sqlite
*.sqlite3

# Temporary files
*.tmp
*.temp
```

## ➕ Step 4: Add Files to Git

```powershell
# Add all files to staging
git add .

# Check what will be committed
git status

# You should see all your project files listed
```

## 💾 Step 5: Create Initial Commit

```powershell
# Create your first commit
git commit -m "Initial commit: DevOps Todo App with CI/CD pipeline"

# Verify commit was created
git log --oneline
```

## 🌐 Step 6: Create GitHub Repository

### Option A: Using GitHub Website (Recommended)

1. **Go to GitHub**: https://github.com
2. **Sign in** to your account
3. **Click the "+" icon** (top right) → **"New repository"**
4. **Repository settings:**
   - **Name**: `devops-todo-app` (or your preferred name)
   - **Description**: "DevOps Todo Application with CI/CD Pipeline"
   - **Visibility**: 
     - ✅ **Public** (if you want to share)
     - ✅ **Private** (if you want it private)
   - **DO NOT** initialize with README, .gitignore, or license
   - Click **"Create repository"**

5. **Copy the repository URL** (you'll see it on the next page)
   - HTTPS: `https://github.com/yourusername/devops-todo-app.git`
   - SSH: `git@github.com:yourusername/devops-todo-app.git`

### Option B: Using GitHub CLI (If Installed)

```powershell
# Install GitHub CLI if not installed
# Download from: https://cli.github.com/

# Authenticate
gh auth login

# Create repository
gh repo create devops-todo-app --public --source=. --remote=origin --push
```

## 🔗 Step 7: Connect Local Repository to GitHub

```powershell
# Add GitHub repository as remote origin
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/devops-todo-app.git

# Verify remote was added
git remote -v

# Should show:
# origin  https://github.com/YOUR_USERNAME/devops-todo-app.git (fetch)
# origin  https://github.com/YOUR_USERNAME/devops-todo-app.git (push)
```

## 📤 Step 8: Push Code to GitHub

```powershell
# Push to GitHub (first time)
git branch -M main
git push -u origin main

# If prompted for credentials:
# Username: your GitHub username
# Password: your GitHub Personal Access Token (NOT your GitHub password)
```

### Creating GitHub Personal Access Token

If you need a Personal Access Token:

1. Go to GitHub → **Settings** → **Developer settings**
2. Click **"Personal access tokens"** → **"Tokens (classic)"**
3. Click **"Generate new token"** → **"Generate new token (classic)"**
4. **Name**: `devops-todo-app`
5. **Select scopes**: 
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (if using GitHub Actions)
6. Click **"Generate token"**
7. **Copy the token** (you won't see it again!)
8. Use this token as your password when pushing

## ✅ Step 9: Verify Deployment

1. **Go to your GitHub repository**: `https://github.com/YOUR_USERNAME/devops-todo-app`
2. **Verify all files are there:**
   - ✅ `docker-compose.yml`
   - ✅ `Jenkinsfile`
   - ✅ `backend/` directory
   - ✅ `frontend/` directory
   - ✅ `README.md`
   - ✅ All other project files

## 🔄 Step 10: Update Jenkins Pipeline for GitHub

Now update your Jenkins pipeline to use GitHub instead of local file system:

1. **Go to Jenkins**: http://localhost:8081
2. **Open your pipeline**: `Todo-App-Pipeline`
3. **Click "Configure"**
4. **Update Pipeline Configuration:**
   - **Definition**: `Pipeline script from SCM`
   - **SCM**: `Git`
   - **Repository URL**: `https://github.com/YOUR_USERNAME/devops-todo-app.git`
   - **Credentials**: 
     - Click **"Add"** → **"Jenkins"**
     - **Kind**: `Username with password`
     - **Username**: Your GitHub username
     - **Password**: Your GitHub Personal Access Token
     - **ID**: `github-credentials`
     - Click **"Add"**
   - **Branches to build**: `*/main` (or `*/master`)
   - **Script Path**: `Jenkinsfile`
5. **Click "Save"**

## 🎯 Step 11: Test Jenkins Pipeline with GitHub

1. **Trigger a build:**
   - Click **"Build Now"** in Jenkins
   - The pipeline will now pull code from GitHub

2. **Watch the build:**
   - Click on the build number
   - View **"Console Output"**
   - Should show: `Checking out code from repository...`

3. **Verify it works:**
   - All stages should complete successfully
   - Application should deploy automatically

## 🔐 Step 11: Set Up GitHub Webhooks (Optional)

To trigger Jenkins builds automatically on Git push:

1. **In GitHub repository:**
   - Go to **Settings** → **Webhooks** → **Add webhook**

2. **Webhook configuration:**
   - **Payload URL**: `http://YOUR_JENKINS_IP:8081/github-webhook/`
   - **Content type**: `application/json`
   - **Events**: Select **"Just the push event"**
   - Click **"Add webhook"**

3. **In Jenkins:**
   - Go to pipeline configuration
   - Under **"Build Triggers"**, select:
     - ✅ **"GitHub hook trigger for GITScm polling"**

4. **Test:**
   - Make a small change
   - Commit and push to GitHub
   - Jenkins should automatically trigger a build

## 📋 Quick Command Reference

```powershell
# Initialize repository
git init

# Add files
git add .

# Commit
git commit -m "Your commit message"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/devops-todo-app.git

# Push to GitHub
git push -u origin main

# Check status
git status

# View commits
git log --oneline

# View remotes
git remote -v

# Pull latest changes
git pull origin main

# Push changes
git push origin main
```

## 🐛 Troubleshooting

### Error: "remote origin already exists"

```powershell
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/devops-todo-app.git
```

### Error: "Authentication failed"

**Solution**: Use Personal Access Token instead of password
1. Create token in GitHub Settings
2. Use token as password when pushing

### Error: "Permission denied (publickey)"

**Solution**: Use HTTPS instead of SSH
```powershell
# Change remote URL to HTTPS
git remote set-url origin https://github.com/YOUR_USERNAME/devops-todo-app.git
```

### Error: "Failed to push some refs"

```powershell
# Pull first, then push
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## ✅ Verification Checklist

- [ ] Git repository initialized
- [ ] All files added and committed
- [ ] GitHub repository created
- [ ] Remote origin added
- [ ] Code pushed to GitHub
- [ ] All files visible on GitHub
- [ ] Jenkins pipeline updated with GitHub URL
- [ ] Jenkins credentials configured
- [ ] Pipeline successfully pulls from GitHub
- [ ] Build completes successfully

## 🎉 Success!

Your project is now on GitHub! 

**Repository URL**: `https://github.com/YOUR_USERNAME/devops-todo-app`

**Next Steps:**
1. Share the repository with your team
2. Set up GitHub Actions (optional)
3. Configure webhooks for automatic builds
4. Add collaborators if needed

---

**Need Help?** Check GitHub documentation: https://docs.github.com

