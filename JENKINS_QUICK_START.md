# 🚀 Jenkins Pipeline - Quick Start Guide

## ✅ Jenkins is Ready!

Your Jenkins server is running and Docker is installed. Follow these steps to deploy your Todo App.

## 📍 Access Jenkins

- **Jenkins URL**: http://localhost:8081
- **Admin Password**: `5fdac6a2bca8405a8390b82b3511d9c5`

## 🔧 Step-by-Step Setup

### 1. Unlock Jenkins (First Time Only)

1. Open http://localhost:8081 in your browser
2. Enter the admin password: `5fdac6a2bca8405a8390b82b3511d9c5`
3. Click **"Continue"**

### 2. Install Plugins

1. Click **"Install suggested plugins"**
2. Wait for installation to complete (~2-3 minutes)

### 3. Create Admin User

- Username: `admin`
- Password: (choose your password)
- Full name: `Admin User`
- Email: (your email)

Click **"Save and Continue"** → **"Save and Finish"** → **"Start using Jenkins"**

### 4. Configure Pipeline Job

1. Click **"New Item"** (on the left sidebar)

2. Enter name: `Todo-App-Pipeline`

3. Select **"Pipeline"** → Click **"OK"**

4. Scroll to **"Pipeline"** section

5. Configure:
   - **Definition**: `Pipeline script from SCM`
   - **SCM**: `Git`
   - **Repository URL**: 
     ```
     file:///workspace
     ```
     (This uses the workspace mounted in Jenkins)
   - **Branches**: `*/main` or `*/master`
   - **Script Path**: `Jenkinsfile`

6. Click **"Save"**

### 5. Run the Pipeline

1. Click on **"Todo-App-Pipeline"** in the dashboard
2. Click **"Build Now"** (left sidebar)
3. Watch the build progress in **"Build History"**
4. Click on the build number (#1) to see logs

## 🎯 What the Pipeline Does

The pipeline will automatically:

1. ✅ **Checkout** - Get code from repository
2. ✅ **Build Backend** - Create Docker image for Flask API
3. ✅ **Test Backend** - Run unit tests
4. ✅ **Build Frontend** - Create Docker image for React app
5. ✅ **Test Frontend** - Run frontend tests
6. ✅ **Deploy** - Blue-Green deployment (zero downtime)
7. ✅ **Health Check** - Verify services are running

## 🔍 Troubleshooting

### Issue: "docker: command not found" in pipeline

**Solution**: Docker is installed. If you see this error, Jenkins might need Docker socket access. The Jenkins container should have access to the host Docker.

### Issue: "Cannot connect to Docker daemon"

**Solution**: Jenkins container needs Docker socket. Check if it's mounted:
```bash
docker inspect jenkins | grep -i docker.sock
```

### Issue: Pipeline can't find Jenkinsfile

**Solution**: 
- Ensure Jenkinsfile is in the project root
- Check "Script Path" is set to `Jenkinsfile`
- Verify repository URL is correct

### Issue: Port conflicts during deployment

**Solution**: Stop existing containers first:
```bash
docker-compose down
```

Then run the pipeline again.

## 📊 Viewing Results

After pipeline completes:

- ✅ **Green checkmark** = Success
- ❌ **Red X** = Failed (check console output)

Click on build number to see:
- **Console Output**: Detailed logs
- **Pipeline Steps**: Visual pipeline view
- **Test Results**: Test reports

## 🎉 Success!

When pipeline succeeds:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🔄 Automatic Builds

To trigger builds automatically:

1. Go to pipeline configuration
2. Under **"Build Triggers"**:
   - Select **"Poll SCM"**
   - Enter: `H/5 * * * *` (every 5 minutes)
   - Or use webhooks for Git repositories

## 📝 Notes

- The pipeline uses Blue-Green deployment for zero downtime
- All Docker images are tagged with build numbers
- Failed builds trigger automatic rollback
- Pipeline cleans up old containers automatically

---

**Need Help?** Check Jenkins logs:
```bash
docker logs jenkins
```

**Jenkins Dashboard**: http://localhost:8081




