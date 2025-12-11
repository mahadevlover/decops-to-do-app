# Docker Registry Setup Guide

## 🐳 Recommended: GitHub Container Registry (GHCR)

Since you're using GitHub, **GitHub Container Registry (GHCR)** is the best option.

### Registry Information:
- **Registry URL**: `ghcr.io`
- **Your Registry Base**: `ghcr.io/mahadevlover`
- **Image Format**: `ghcr.io/mahadevlover/image-name:tag`

### Example Images:
- Backend: `ghcr.io/mahadevlover/devops-todo-backend:latest`
- Frontend: `ghcr.io/mahadevlover/devops-todo-frontend:latest`

## 📋 Setup Steps

### Step 1: Create GitHub Personal Access Token

1. Go to GitHub → **Settings** → **Developer settings**
2. Click **Personal access tokens** → **Tokens (classic)**
3. Click **Generate new token (classic)**
4. **Name**: `docker-registry-token`
5. **Expiration**: Choose your preference
6. **Select scopes**:
   - ✅ `write:packages` (to push images)
   - ✅ `read:packages` (to pull images)
   - ✅ `delete:packages` (to delete images)
7. Click **Generate token**
8. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Login to GitHub Container Registry

```powershell
# Login to GHCR
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u mahadevlover --password-stdin

# Or interactive login
docker login ghcr.io
# Username: mahadevlover
# Password: YOUR_GITHUB_TOKEN
```

### Step 3: Tag Your Images

```powershell
# Tag backend image
docker tag devops-todo-app-backend:latest ghcr.io/mahadevlover/devops-todo-backend:latest

# Tag frontend image
docker tag devops-todo-app-frontend:latest ghcr.io/mahadevlover/devops-todo-frontend:latest

# Tag with version
docker tag devops-todo-app-backend:latest ghcr.io/mahadevlover/devops-todo-backend:v1.0.0
```

### Step 4: Push Images to Registry

```powershell
# Push backend
docker push ghcr.io/mahadevlover/devops-todo-backend:latest

# Push frontend
docker push ghcr.io/mahadevlover/devops-todo-frontend:latest
```

## 🔄 Alternative: Docker Hub

### Registry Information:
- **Registry URL**: `docker.io` or `registry-1.docker.io`
- **Your Registry Base**: `docker.io/mahadevlover` or just `mahadevlover`
- **Image Format**: `mahadevlover/image-name:tag`

### Setup:

1. **Create Docker Hub account**: https://hub.docker.com
2. **Login**:
   ```powershell
   docker login
   # Username: mahadevlover
   # Password: Your Docker Hub password
   ```

3. **Tag and Push**:
   ```powershell
   docker tag devops-todo-app-backend:latest mahadevlover/devops-todo-backend:latest
   docker push mahadevlover/devops-todo-backend:latest
   ```

## 🚀 Update Jenkinsfile for Registry

Here's how to update your Jenkinsfile to push to registry:

```groovy
stage('Build and Push Backend') {
    steps {
        script {
            dir('backend') {
                sh 'docker build -t todo-backend:${BUILD_NUMBER} .'
                sh 'docker tag todo-backend:${BUILD_NUMBER} ghcr.io/mahadevlover/devops-todo-backend:${BUILD_NUMBER}'
                sh 'docker tag todo-backend:${BUILD_NUMBER} ghcr.io/mahadevlover/devops-todo-backend:latest'
                sh 'docker push ghcr.io/mahadevlover/devops-todo-backend:${BUILD_NUMBER}'
                sh 'docker push ghcr.io/mahadevlover/devops-todo-backend:latest'
            }
        }
    }
}

stage('Build and Push Frontend') {
    steps {
        script {
            dir('frontend') {
                sh 'docker build -t todo-frontend:${BUILD_NUMBER} .'
                sh 'docker tag todo-frontend:${BUILD_NUMBER} ghcr.io/mahadevlover/devops-todo-frontend:${BUILD_NUMBER}'
                sh 'docker tag todo-frontend:${BUILD_NUMBER} ghcr.io/mahadevlover/devops-todo-frontend:latest'
                sh 'docker push ghcr.io/mahadevlover/devops-todo-frontend:${BUILD_NUMBER}'
                sh 'docker push ghcr.io/mahadevlover/devops-todo-frontend:latest'
            }
        }
    }
}
```

## 🔐 Configure Jenkins Credentials

### For GitHub Container Registry:

1. Go to Jenkins → **Manage Jenkins** → **Credentials**
2. Click **Add Credentials**
3. Configure:
   - **Kind**: `Username with password`
   - **Scope**: `Global`
   - **Username**: `mahadevlover`
   - **Password**: Your GitHub Personal Access Token
   - **ID**: `ghcr-credentials`
   - **Description**: `GitHub Container Registry`
4. Click **OK**

### Use in Pipeline:

```groovy
stage('Build and Push') {
    steps {
        script {
            withCredentials([usernamePassword(credentialsId: 'ghcr-credentials', usernameVariable: 'GHCR_USER', passwordVariable: 'GHCR_TOKEN')]) {
                sh '''
                    echo $GHCR_TOKEN | docker login ghcr.io -u $GHCR_USER --password-stdin
                    docker tag todo-backend:latest ghcr.io/mahadevlover/devops-todo-backend:latest
                    docker push ghcr.io/mahadevlover/devops-todo-backend:latest
                '''
            }
        }
    }
}
```

## 📍 Quick Reference

### GitHub Container Registry (GHCR):
- **Registry**: `ghcr.io`
- **Your Images**: `ghcr.io/mahadevlover/*`
- **View Packages**: https://github.com/mahadevlover?tab=packages

### Docker Hub:
- **Registry**: `docker.io`
- **Your Images**: `mahadevlover/*`
- **View Images**: https://hub.docker.com/u/mahadevlover

## ✅ Verification

After pushing, verify your images:

```powershell
# List your images in GHCR
docker search ghcr.io/mahadevlover/

# Pull and test
docker pull ghcr.io/mahadevlover/devops-todo-backend:latest
```

## 🎯 Recommended Setup

For your project, I recommend:
- **Registry**: GitHub Container Registry (ghcr.io)
- **Backend Image**: `ghcr.io/mahadevlover/devops-todo-backend:latest`
- **Frontend Image**: `ghcr.io/mahadevlover/devops-todo-frontend:latest`

This keeps everything in one place with your GitHub repository!

