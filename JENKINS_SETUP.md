# Jenkins Pipeline Setup Guide

## 🚀 Quick Start

Your Jenkins server is now running! Follow these steps to set up the CI/CD pipeline.

## 📍 Access Jenkins

- **Jenkins URL**: http://localhost:8081
- **Initial Admin Password**: `5fdac6a2bca8405a8390b82b3511d9c5`

## 🔧 Setup Steps

### Step 1: Initial Jenkins Setup

1. Open your browser and go to: **http://localhost:8081**

2. You'll see the "Unlock Jenkins" page. Enter the admin password:
   ```
   5fdac6a2bca8405a8390b82b3511d9c5
   ```

3. Click **"Continue"**

4. On the "Customize Jenkins" page, click **"Install suggested plugins"**

5. Wait for plugins to install (this may take a few minutes)

6. Create your admin user:
   - Username: `admin` (or your choice)
   - Password: (choose a secure password)
   - Full name: `Admin User`
   - Email: (your email)

7. Click **"Save and Continue"**

8. Click **"Save and Finish"**

9. Click **"Start using Jenkins"**

### Step 2: Configure Docker Access (Important!)

Jenkins needs access to Docker to build and deploy containers.

1. Go to **Manage Jenkins** → **Manage Nodes and Clouds** → **Configure Clouds**

2. Or go directly to: **Manage Jenkins** → **Configure System**

3. Scroll down to find Docker configuration

4. Alternatively, verify Docker access by:
   - Go to **Manage Jenkins** → **System Information**
   - Check if Docker is available

### Step 3: Create the Pipeline

1. Click **"New Item"** on the Jenkins dashboard

2. Enter item name: `Todo-App-Pipeline`

3. Select **"Pipeline"** as the project type

4. Click **"OK"**

5. Scroll down to **"Pipeline"** section

6. In **"Definition"**, select **"Pipeline script from SCM"**

7. Configure:
   - **SCM**: `Git`
   - **Repository URL**: 
     - If using local repository: Use the file path
     - If using Git repository: Enter your Git URL
   - **Branches to build**: `*/main` or `*/master`
   - **Script Path**: `Jenkinsfile`

8. Click **"Save"**

### Step 4: Run the Pipeline

1. Click on **"Todo-App-Pipeline"** in the dashboard

2. Click **"Build Now"** (on the left sidebar)

3. Watch the build progress in **"Build History"**

4. Click on the build number to see detailed logs

5. The pipeline will:
   - ✅ Checkout code
   - ✅ Build Backend Docker image
   - ✅ Test Backend
   - ✅ Build Frontend Docker image
   - ✅ Test Frontend
   - ✅ Deploy application (Blue-Green deployment)
   - ✅ Health check

## 📋 Pipeline Stages

The pipeline includes these stages:

1. **Checkout**: Gets code from repository
2. **Build Backend**: Creates Docker image for backend
3. **Test Backend**: Runs backend unit tests
4. **Build Frontend**: Creates Docker image for frontend
5. **Test Frontend**: Runs frontend tests
6. **Deploy**: Blue-Green deployment with zero downtime
7. **Health Check**: Verifies services are running

## 🔍 Troubleshooting

### Issue: Jenkins can't access Docker

**Solution**: Ensure Jenkins container has Docker socket access:
```bash
docker exec jenkins docker ps
```

If this fails, you may need to restart Jenkins with Docker socket mounted:
```bash
docker stop jenkins
docker run -d --name jenkins \
  -p 8081:8080 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v jenkins-data:/var/jenkins_home \
  jenkins/jenkins:lts-jdk17
```

### Issue: Build fails with "docker: command not found"

**Solution**: Install Docker in Jenkins container:
```bash
docker exec -u root jenkins apt-get update
docker exec -u root jenkins apt-get install -y docker.io
```

### Issue: Pipeline can't find Jenkinsfile

**Solution**: 
- Ensure Jenkinsfile is in the root directory
- Check the "Script Path" in pipeline configuration
- Verify repository URL is correct

### Issue: Port conflicts

**Solution**: If ports 3000 or 5000 are already in use:
- Stop existing containers: `docker-compose down`
- Or modify docker-compose.yml to use different ports

## 🎯 Manual Pipeline Trigger

You can also trigger the pipeline via command line:

```bash
# Using Jenkins CLI (if installed)
java -jar jenkins-cli.jar -s http://localhost:8081 build Todo-App-Pipeline

# Or using curl
curl -X POST http://localhost:8081/job/Todo-App-Pipeline/build \
  --user admin:YOUR_API_TOKEN
```

## 📊 Viewing Build Results

1. Go to **Todo-App-Pipeline** dashboard
2. Click on a build number
3. View:
   - **Console Output**: Detailed build logs
   - **Pipeline Steps**: Visual pipeline view
   - **Test Results**: Test reports
   - **Artifacts**: Build artifacts

## 🔄 Automatic Builds

To enable automatic builds on Git push:

1. Go to pipeline configuration
2. Under **"Build Triggers"**, select:
   - **"Poll SCM"**: Check repository periodically
   - **"GitHub hook trigger"**: For GitHub webhooks
   - **"Build when a change is pushed to GitLab"**: For GitLab

## ✅ Success Indicators

You'll know the pipeline is working when:

- ✅ All stages show green checkmarks
- ✅ Build completes successfully
- ✅ Application is accessible at http://localhost:3000
- ✅ Backend API responds at http://localhost:5000/api/health
- ✅ No errors in console output

## 🎉 Next Steps

After successful deployment:

1. **Monitor**: Check application logs
2. **Test**: Verify all features work
3. **Automate**: Set up webhooks for automatic builds
4. **Optimize**: Tune pipeline for faster builds

---

**Need Help?** Check the Jenkins logs:
```bash
docker logs jenkins
```

**Jenkins is running on**: http://localhost:8081




