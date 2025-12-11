# 🚀 Complete Deployment Guide - DevOps Todo App

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose installed
- Git (optional, if using Git repository)

## 🔧 Step 1: Navigate to Project Directory

**Important**: Make sure you're in the correct project directory!

```powershell
# Navigate to your project directory
cd C:\Users\Gulshan Bhati\OneDrive\Documents\ibm\devops-todo-app

# Or if you're in a different location:
cd "C:\path\to\your\devops-todo-app"
```

**Verify you're in the right place:**
```powershell
# Check if docker-compose.yml exists
dir docker-compose.yml

# Should show: docker-compose.yml
```

## 🐳 Step 2: Start the Application

### Option A: Using Docker Compose (Recommended)

```powershell
# Make sure you're in the project root directory
# The docker-compose.yml file should be in the current directory

# Start all services
docker-compose up -d

# Or using newer Docker Compose syntax:
docker compose up -d
```

### Option B: Using the Start Script (If Available)

```powershell
# On Windows, you might need to use Git Bash or WSL
bash start.sh

# Or manually:
docker-compose build
docker-compose up -d
```

### Verify Services are Running

```powershell
# Check container status
docker-compose ps

# View logs
docker-compose logs -f

# Check specific service
docker-compose logs backend
docker-compose logs frontend
```

## 🌐 Step 3: Access the Application

Once containers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🔄 Step 4: Set Up Jenkins CI/CD Pipeline

### 4.1: Start Jenkins

```powershell
# Navigate to jenkins directory
cd jenkins

# Start Jenkins
docker-compose up -d

# Or if using the existing Jenkins container:
docker start jenkins

# Check Jenkins status
docker ps | findstr jenkins
```

### 4.2: Access Jenkins

1. Open browser: **http://localhost:8081** (or port 8080 if configured differently)

2. Get initial admin password:
   ```powershell
   docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```

3. Unlock Jenkins with the password

4. Install suggested plugins

5. Create admin user

### 4.3: Configure Pipeline in Jenkins

1. **Create New Pipeline Job:**
   - Click **"New Item"**
   - Name: `Todo-App-Pipeline`
   - Select **"Pipeline"**
   - Click **"OK"**

2. **Configure Pipeline:**
   - Scroll to **"Pipeline"** section
   - **Definition**: `Pipeline script from SCM`
   - **SCM**: `Git`
   - **Repository URL**: 
     - For local file system: `file:///C:/Users/Gulshan%20Bhati/OneDrive/Documents/ibm/devops-todo-app`
     - Or use your Git repository URL
   - **Branches**: `*/main` or `*/master`
   - **Script Path**: `Jenkinsfile`

3. **Save and Build:**
   - Click **"Save"**
   - Click **"Build Now"**

## 🛠️ Troubleshooting

### Error: "no configuration file provided: not found"

**Problem**: You're not in the correct directory or docker-compose.yml is missing.

**Solution**:
```powershell
# 1. Check current directory
pwd
# or
cd

# 2. List files to verify docker-compose.yml exists
dir docker-compose.yml

# 3. If file doesn't exist, navigate to project root
cd "C:\Users\Gulshan Bhati\OneDrive\Documents\ibm\devops-todo-app"

# 4. Verify file exists
dir docker-compose.yml

# 5. Now run docker-compose
docker-compose up -d
```

### Error: "Port already in use"

**Solution**:
```powershell
# Stop existing containers
docker-compose down

# Or stop specific containers
docker stop todo-backend todo-frontend

# Then start again
docker-compose up -d
```

### Error: "Cannot connect to Docker daemon"

**Solution**:
1. Make sure Docker Desktop is running
2. Check Docker status:
   ```powershell
   docker ps
   ```
3. Restart Docker Desktop if needed

### Error: Jenkins can't access Docker

**Solution**:
```powershell
# Install Docker in Jenkins container (if not already done)
docker exec -u root jenkins apt-get update
docker exec -u root jenkins apt-get install -y docker.io docker-compose

# Add jenkins user to docker group
docker exec -u root jenkins usermod -aG docker jenkins

# Restart Jenkins
docker restart jenkins
```

### Error: "Permission denied" in Jenkins pipeline

**Solution**: Jenkins container needs Docker socket access. On Windows, this is handled differently. The Jenkins container should be able to access the host Docker.

## 📁 Project Structure

```
devops-todo-app/
├── docker-compose.yml      ← Main compose file (MUST be in root)
├── Jenkinsfile             ← Jenkins pipeline definition
├── backend/
│   ├── Dockerfile
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── jenkins/
│   ├── docker-compose.yml
│   └── Dockerfile
└── README.md
```

## ✅ Verification Checklist

Before running Jenkins pipeline:

- [ ] Docker Desktop is running
- [ ] You're in the project root directory
- [ ] `docker-compose.yml` exists in current directory
- [ ] Application runs successfully: `docker-compose up -d`
- [ ] Frontend accessible at http://localhost:3000
- [ ] Backend accessible at http://localhost:5000/api/health
- [ ] Jenkins is running: `docker ps | findstr jenkins`
- [ ] Jenkins accessible at http://localhost:8081
- [ ] Docker installed in Jenkins container
- [ ] Pipeline job created in Jenkins
- [ ] Jenkinsfile path is correct in pipeline config

## 🎯 Quick Commands Reference

```powershell
# Navigate to project
cd "C:\Users\Gulshan Bhati\OneDrive\Documents\ibm\devops-todo-app"

# Start application
docker-compose up -d

# Stop application
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d

# Check status
docker-compose ps

# Start Jenkins
docker start jenkins

# Jenkins logs
docker logs jenkins

# Get Jenkins admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

## 🔍 Common Directory Issues

### Issue: Working from wrong directory

**Always verify you're in the project root:**

```powershell
# Check current location
Get-Location
# or
pwd

# List files - you should see docker-compose.yml
dir

# If docker-compose.yml is not visible, navigate to correct directory
cd "C:\Users\Gulshan Bhati\OneDrive\Documents\ibm\devops-todo-app"
```

### Issue: Spaces in path

If your path has spaces (like "OneDrive\Documents"), make sure to:
- Use quotes around the path
- Or use the full path with quotes

```powershell
cd "C:\Users\Gulshan Bhati\OneDrive\Documents\ibm\devops-todo-app"
```

## 📞 Next Steps

1. ✅ Fix the directory issue (make sure you're in project root)
2. ✅ Start the application: `docker-compose up -d`
3. ✅ Verify it works: Open http://localhost:3000
4. ✅ Set up Jenkins pipeline following Step 4 above
5. ✅ Run the pipeline and watch it deploy!

---

**Remember**: The `docker-compose.yml` file MUST be in the directory where you run `docker-compose` commands!


