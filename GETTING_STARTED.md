# Getting Started Guide

## 🎯 Welcome to DevOps Todo App!

This guide will help you get the application running in **less than 5 minutes**.

---

## ⚡ Quick Start (Fastest Way)

### Prerequisites
- Docker Desktop installed and running
- 8GB RAM available
- Ports 3000, 5000 available

### Three Simple Steps:

```bash
# 1. Verify your system is ready
./verify-setup.sh

# 2. Start the application
./start.sh

# 3. Open your browser
http://localhost:3000
```

That's it! Your Todo app is now running! 🎉

---

## 📋 Step-by-Step Instructions

### Step 1: Install Prerequisites

#### Install Docker Desktop
- **Windows/Mac**: Download from https://www.docker.com/products/docker-desktop
- **Linux**: Install Docker Engine from your package manager

#### Verify Installation
```bash
docker --version
docker compose version
```

You should see version numbers. If not, restart Docker Desktop.

### Step 2: Download the Project

```bash
# If you have the ZIP file
unzip devops-todo-app.zip
cd devops-todo-app

# If you have a Git repository
git clone <repository-url>
cd devops-todo-app
```

### Step 3: Verify Setup

```bash
./verify-setup.sh
```

This checks:
- ✅ All required files are present
- ✅ Docker is installed and running
- ✅ Required ports are available
- ✅ System meets requirements

### Step 4: Start the Application

```bash
./start.sh
```

This will:
1. Build Docker images (takes 3-5 minutes first time)
2. Start all services
3. Wait for services to be healthy
4. Display access URLs

### Step 5: Access the Application

Open your web browser and go to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health

---

## 🎮 Using the Application

### Create a Todo
1. Type your task in the input field
2. Click "Add Task"
3. Your task appears in the list

### Complete a Todo
1. Click the checkbox next to any task
2. Task becomes grayed out (completed)

### Delete a Todo
1. Click the "Delete" button next to any task
2. Task is removed from the list

---

## 🧪 Running Tests

### Integration Tests
```bash
cd tests
./integration-test.sh
```

This tests:
- Backend health
- Frontend availability
- API endpoints (GET, POST, PUT, DELETE)
- Container health

### Backend Unit Tests
```bash
cd backend
docker run --rm todo-backend:latest pytest test_app.py -v
```

### Frontend Unit Tests
```bash
cd frontend
npm install
npm test
```

---

## 🔧 Advanced Setup

### Start Jenkins CI/CD

```bash
cd jenkins
docker-compose up -d

# Get admin password
docker exec jenkins-server cat /var/jenkins_home/secrets/initialAdminPassword
```

Access Jenkins at: http://localhost:8080

### Start Monitoring

```bash
cd monitoring
docker-compose up -d
```

Access:
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)

---

## 📊 Viewing Logs

### All Services
```bash
docker-compose logs -f
```

### Specific Service
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Last 50 Lines
```bash
docker-compose logs --tail=50
```

---

## 🛑 Stopping the Application

### Stop Services (Keep Data)
```bash
docker-compose down
```

### Stop and Remove All Data
```bash
docker-compose down -v
```

### Restart Services
```bash
docker-compose restart
```

---

## 🆘 Troubleshooting

### Problem: Docker is not running
**Solution**: Start Docker Desktop application

### Problem: Port 3000 is already in use
**Solution**:
```bash
lsof -i :3000
kill -9 <PID>
```

### Problem: Services won't start
**Solution**:
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Problem: Frontend shows error
**Solution**:
1. Check if backend is running: `curl http://localhost:5000/api/health`
2. Check logs: `docker-compose logs frontend`
3. Restart: `docker-compose restart frontend`

### Problem: Cannot access application
**Solution**:
```bash
# Check if containers are running
docker-compose ps

# Check if services are healthy
docker-compose ps

# All should show "healthy" status
```

---

## 💡 Tips & Tricks

### 1. Check Service Status
```bash
docker-compose ps
```

### 2. View Resource Usage
```bash
docker stats
```

### 3. Access Container Shell
```bash
# Backend
docker exec -it todo-backend /bin/sh

# Frontend
docker exec -it todo-frontend /bin/sh
```

### 4. Clean Up Docker
```bash
# Remove unused containers, networks, images
docker system prune -a

# Remove unused volumes
docker volume prune
```

### 5. Rebuild After Code Changes
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

---

## 📖 Next Steps

### For Development
1. Read `docs/DEPLOYMENT.md` for detailed deployment info
2. Check `docs/PROJECT_SUMMARY.md` for architecture details
3. Review code in `frontend/src/` and `backend/`

### For Demonstration
1. Read `SUBMISSION_CHECKLIST.md`
2. Practice the demo flow
3. Review `QUICK_REFERENCE.md`

### For Learning
1. Explore the Jenkinsfile to understand CI/CD
2. Check docker-compose.yml for service configuration
3. Review Dockerfiles for containerization

---

## 🎯 Common Use Cases

### Use Case 1: Just Testing the App
```bash
./start.sh
# Open http://localhost:3000
# Play with the app
docker-compose down
```

### Use Case 2: Development
```bash
./start.sh
# Make code changes
docker-compose build
docker-compose up -d
# Test changes
```

### Use Case 3: Full Demo
```bash
./verify-setup.sh
./start.sh
cd tests && ./integration-test.sh
cd ../jenkins && docker-compose up -d
cd ../monitoring && docker-compose up -d
# Show everything is working
```

---

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ `./verify-setup.sh` shows all green checkmarks
2. ✅ `docker-compose ps` shows all services "healthy"
3. ✅ http://localhost:3000 loads the Todo app
4. ✅ http://localhost:5000/api/health returns "healthy"
5. ✅ You can add, complete, and delete todos
6. ✅ `./integration-test.sh` all tests pass

---

## 🎓 Understanding the Project

### Architecture
- **Frontend**: React app served by Nginx
- **Backend**: Python Flask REST API
- **Database**: SQLite with persistent volume
- **CI/CD**: Jenkins pipeline automation
- **Monitoring**: Prometheus + Grafana

### Key Technologies
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Jenkins**: Continuous Integration/Deployment
- **React**: Frontend framework
- **Flask**: Backend framework
- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization

---

## 📞 Getting Help

### Documentation
- Main README: `README.md`
- Deployment Guide: `docs/DEPLOYMENT.md`
- Project Summary: `docs/PROJECT_SUMMARY.md`
- Quick Reference: `QUICK_REFERENCE.md`

### Debugging
1. Check logs: `docker-compose logs`
2. Check status: `docker-compose ps`
3. Verify setup: `./verify-setup.sh`
4. Review troubleshooting section above

### Support
- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation

---

## 🎉 You're All Set!

You now have a fully functional DevOps pipeline with:
- ✅ Working Todo application
- ✅ Automated CI/CD pipeline
- ✅ Monitoring and logging
- ✅ Automated testing
- ✅ Complete documentation

**Ready to proceed?** Start with `./verify-setup.sh` and `./start.sh`!

---

**Happy DevOps-ing! 🚀**
