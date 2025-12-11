# Deployment Guide - DevOps Todo Application

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Deployment](#docker-deployment)
4. [Jenkins CI/CD Setup](#jenkins-cicd-setup)
5. [Monitoring Setup](#monitoring-setup)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Docker Desktop**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Git**: Latest version
- **Ports Required**: 3000, 5000, 8080, 9090, 3001

### System Requirements
- **OS**: Windows 10/11, macOS, or Linux
- **RAM**: Minimum 8GB (16GB recommended)
- **Disk Space**: Minimum 10GB free space
- **CPU**: 2 cores minimum (4 cores recommended)

### Verify Installation
```bash
# Check Docker
docker --version
docker compose version

# Check Git
git --version

# Check Docker is running
docker info
```

---

## Local Development Setup

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd devops-todo-app
```

### Step 2: Quick Start
```bash
# Use the automated script
./start.sh
```

OR manually:

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

### Step 3: Verify Deployment
```bash
# Check backend
curl http://localhost:5000/api/health

# Check frontend
curl http://localhost:3000

# View logs
docker-compose logs -f
```

---

## Docker Deployment

### Architecture Overview
```
┌─────────────────────────────────────────┐
│          Docker Host                     │
│  ┌─────────────┐  ┌──────────────┐     │
│  │  Frontend   │  │   Backend    │     │
│  │  (React)    │→ │   (Flask)    │     │
│  │  Port: 3000 │  │   Port: 5000 │     │
│  └─────────────┘  └──────────────┘     │
│         │                  │             │
│         └──────┬───────────┘             │
│                ▼                         │
│         ┌─────────────┐                 │
│         │  Database   │                 │
│         │  (SQLite)   │                 │
│         └─────────────┘                 │
└─────────────────────────────────────────┘
```

### Service Details

#### Frontend Service
- **Image**: Custom Nginx with React build
- **Port**: 3000
- **Health Check**: HTTP GET /
- **Dependencies**: Backend service

#### Backend Service
- **Image**: Python 3.11 with Flask
- **Port**: 5000
- **Health Check**: HTTP GET /api/health
- **Volume**: Persistent database storage

### Docker Commands Reference

#### Build Commands
```bash
# Build all services
docker-compose build

# Build without cache
docker-compose build --no-cache

# Build specific service
docker-compose build frontend
```

#### Service Management
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart specific service
docker-compose restart backend

# View service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

#### Debugging
```bash
# Enter container shell
docker exec -it todo-backend /bin/sh
docker exec -it todo-frontend /bin/sh

# Check container stats
docker stats

# Inspect service
docker inspect todo-backend
```

---

## Jenkins CI/CD Setup

### Step 1: Start Jenkins Server
```bash
cd jenkins
docker-compose up -d

# Wait for Jenkins to start (2-3 minutes)
sleep 120

# Get initial password
docker exec jenkins-server cat /var/jenkins_home/secrets/initialAdminPassword
```

### Step 2: Initial Configuration
1. Open browser: http://localhost:8080
2. Enter the admin password from previous step
3. Select "Install suggested plugins"
4. Wait for plugin installation (5-10 minutes)
5. Create admin user:
   - Username: admin
   - Password: admin123
   - Email: admin@example.com

### Step 3: Configure Docker Access
Jenkins container needs Docker socket access (already configured in docker-compose)

Verify with:
```bash
docker exec jenkins-server docker ps
```

### Step 4: Create Pipeline Job

#### Option A: Using Jenkinsfile from SCM
1. Click "New Item"
2. Name: "Todo-App-Pipeline"
3. Type: "Pipeline"
4. Pipeline Definition: "Pipeline script from SCM"
5. SCM: Git
6. Repository URL: <your-git-repo-url>
7. Branch: */main
8. Script Path: Jenkinsfile
9. Save

#### Option B: Direct Pipeline Script
1. Click "New Item"
2. Name: "Todo-App-Pipeline"
3. Type: "Pipeline"
4. Pipeline Definition: "Pipeline script"
5. Copy contents from Jenkinsfile
6. Save

### Step 5: Run Pipeline
1. Click "Build Now"
2. Monitor build in "Console Output"
3. Pipeline stages:
   - ✓ Checkout
   - ✓ Build Backend
   - ✓ Test Backend
   - ✓ Build Frontend
   - ✓ Test Frontend
   - ✓ Deploy
   - ✓ Health Check

### Pipeline Configuration

#### Environment Variables
```groovy
environment {
    DOCKER_COMPOSE_VERSION = '2.20.0'
    PROJECT_NAME = 'todo-app'
}
```

#### Build Triggers
Configure automatic builds:
- Poll SCM: H/5 * * * * (every 5 minutes)
- Webhook trigger from Git

#### Notifications
Add email notifications in pipeline:
```groovy
post {
    success {
        mail to: 'team@example.com',
             subject: "Build Successful: ${env.JOB_NAME}",
             body: "Good news! Build ${env.BUILD_NUMBER} succeeded."
    }
}
```

---

## Monitoring Setup

### Step 1: Start Monitoring Stack
```bash
cd monitoring
docker-compose up -d

# Verify services
docker-compose ps
```

### Step 2: Access Prometheus
1. Open: http://localhost:9090
2. Go to Status → Targets
3. Verify all targets are UP
4. Query examples:
   - `up{job="backend"}`
   - `up{job="frontend"}`

### Step 3: Configure Grafana
1. Open: http://localhost:3001
2. Login:
   - Username: admin
   - Password: admin
3. Add Data Source:
   - Type: Prometheus
   - URL: http://prometheus:9090
   - Save & Test

### Step 4: Create Dashboard
1. Click "+" → "Import"
2. Import dashboard ID: 1860 (Node Exporter)
3. Select Prometheus data source
4. Import

### Custom Metrics
Monitor these application metrics:
- API response time
- Request count
- Error rate
- Container health status

---

## Testing

### Manual Testing

#### 1. Frontend Testing
```bash
# Open browser
http://localhost:3000

# Test features:
- Add new todo
- Mark todo as complete
- Delete todo
- Verify UI updates
```

#### 2. Backend API Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Get all todos
curl http://localhost:5000/api/todos

# Create todo
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","completed":false}'

# Update todo (replace {id} with actual ID)
curl -X PUT http://localhost:5000/api/todos/{id} \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete todo
curl -X DELETE http://localhost:5000/api/todos/{id}
```

### Automated Testing

#### Backend Unit Tests
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run tests
pytest test_app.py -v

# With coverage
pytest --cov=app test_app.py
```

#### Frontend Unit Tests
```bash
cd frontend

# Install dependencies
npm install

# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

#### Integration Tests
```bash
cd tests

# Make executable
chmod +x integration-test.sh

# Run tests
./integration-test.sh
```

Expected output:
```
Testing: Backend API Health ... PASSED
Testing: Frontend Availability ... PASSED
Testing: GET /api/todos ... PASSED
Testing: POST /api/todos ... PASSED
Testing: PUT /api/todos/1 ... PASSED
Testing: DELETE /api/todos/1 ... PASSED
```

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
**Problem**: Cannot start service because port is occupied

**Solution**:
```bash
# Check what's using the port
lsof -i :3000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "3001:80"  # Changed from 3000
```

#### 2. Docker Build Fails
**Problem**: Build fails with errors

**Solution**:
```bash
# Clean build
docker-compose down -v
docker system prune -a
docker-compose build --no-cache
docker-compose up -d
```

#### 3. Services Not Healthy
**Problem**: Health checks failing

**Solution**:
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Check container status
docker-compose ps

# Restart services
docker-compose restart
```

#### 4. Frontend Cannot Connect to Backend
**Problem**: CORS errors or connection refused

**Solution**:
```bash
# Verify backend is running
curl http://localhost:5000/api/health

# Check nginx configuration
docker exec todo-frontend cat /etc/nginx/conf.d/default.conf

# Check network
docker network inspect devops-todo-app_todo-network
```

#### 5. Database Issues
**Problem**: Data not persisting or errors

**Solution**:
```bash
# Remove and recreate volume
docker-compose down -v
docker-compose up -d

# Check volume
docker volume ls
docker volume inspect devops-todo-app_todo-data
```

#### 6. Jenkins Build Fails
**Problem**: Pipeline fails at build stage

**Solution**:
```bash
# Check Jenkins logs
docker logs jenkins-server

# Verify Docker socket
docker exec jenkins-server docker ps

# Check workspace permissions
docker exec jenkins-server ls -la /workspace
```

### Logs and Debugging

#### View All Logs
```bash
docker-compose logs
```

#### Follow Specific Service
```bash
docker-compose logs -f backend
```

#### Last 100 Lines
```bash
docker-compose logs --tail=100
```

#### Debug Container
```bash
# Enter container
docker exec -it todo-backend /bin/bash

# Check processes
docker exec todo-backend ps aux

# Check network
docker exec todo-backend ping backend
```

### Performance Issues

#### High Memory Usage
```bash
# Check resource usage
docker stats

# Increase Docker memory in Docker Desktop settings
# Recommended: 4GB minimum
```

#### Slow Build Times
```bash
# Use build cache
docker-compose build

# Multi-stage builds (already implemented)
# Clean up old images
docker image prune -a
```

---

## Rollback Procedure

### Automatic Rollback
Jenkins pipeline automatically rolls back on failure.

### Manual Rollback
```bash
# Stop current deployment
docker-compose down

# Use previous images
docker-compose up -d

# Or rebuild from specific commit
git checkout <previous-commit>
docker-compose build
docker-compose up -d
```

---

## Production Considerations

### Before Production Deployment

1. **Security**
   - Change all default passwords
   - Use environment secrets
   - Enable HTTPS
   - Implement authentication

2. **Performance**
   - Use production builds
   - Enable caching
   - Configure CDN
   - Database optimization

3. **Monitoring**
   - Set up alerts
   - Configure log aggregation
   - Enable metrics collection
   - Set up uptime monitoring

4. **Backup**
   - Implement database backups
   - Volume backup strategy
   - Disaster recovery plan

5. **Scaling**
   - Load balancer configuration
   - Horizontal scaling setup
   - Auto-scaling policies

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Flask Best Practices](https://flask.palletsprojects.com/en/latest/patterns/)
- [React Deployment](https://create-react-app.dev/docs/deployment/)

---

## Support

For issues:
1. Check troubleshooting section
2. Review logs: `docker-compose logs`
3. Create issue in repository
4. Contact: [your-email]

---

**Last Updated**: December 2024
**Version**: 1.0.0
