# DevOps Todo Application - CI/CD Pipeline Project

A complete DevOps solution demonstrating Continuous Integration and Continuous Deployment using a microservices-based Todo application.

## 📋 Project Overview

This project implements a full DevOps pipeline for a Todo application with:
- **Frontend**: React-based user interface
- **Backend**: Python Flask REST API
- **Database**: SQLite (containerized)
- **CI/CD**: Jenkins pipeline
- **Monitoring**: Prometheus + Grafana
- **Containerization**: Docker & Docker Compose

## 🎯 Requirements Fulfilled

| # | Requirement | Implementation |
|---|-------------|----------------|
| 1 | Git, Jenkins, Docker | ✅ Complete pipeline using these tools |
| 2 | Multiple microservices | ✅ Frontend + Backend + Database services |
| 3 | Automated testing | ✅ Unit tests (pytest) + Integration tests |
| 4 | Minimal downtime deployment | ✅ Blue-Green deployment strategy |
| 5 | Monitoring & logging | ✅ Prometheus + Grafana setup |
| 6 | Rollback process | ✅ Automated rollback in Jenkins pipeline |
| 7 | Documentation | ✅ Complete README + inline documentation |

## 🏗️ Architecture

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│   Frontend      │  (React + Nginx)
│   Port: 3000    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend       │  (Flask API)
│   Port: 5000    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Database      │  (SQLite)
│   /data volume  │
└─────────────────┘

CI/CD Pipeline:
Git → Jenkins → Build → Test → Deploy → Monitor
```

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed
- Docker Compose installed
- Git installed
- 8GB RAM minimum
- Ports available: 3000, 5000, 8080, 9090, 3001

### 1. Clone the Repository
```bash
git clone <repository-url>
cd devops-todo-app
```

### 2. Start the Application
```bash
# Build and start all services
docker-compose up -d

# Check service status
docker-compose ps
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

### 4. Run Tests
```bash
# Integration tests
cd tests
./integration-test.sh

# Backend unit tests
cd backend
docker run --rm todo-backend:latest pytest test_app.py -v
```

## 🔧 Jenkins CI/CD Pipeline Setup

### Start Jenkins Server
```bash
cd jenkins
docker-compose up -d

# Get initial admin password
docker exec jenkins-server cat /var/jenkins_home/secrets/initialAdminPassword
```

### Access Jenkins
1. Open: http://localhost:8080
2. Enter the initial admin password
3. Install suggested plugins
4. Create admin user

### Configure Pipeline
1. Create New Item → Pipeline
2. Name: "Todo-App-Pipeline"
3. Pipeline Definition: "Pipeline script from SCM"
4. SCM: Git
5. Repository URL: <your-repo-url>
6. Script Path: `Jenkinsfile`
7. Save and Build

### Pipeline Stages
```
Checkout → Build Backend → Test Backend → 
Build Frontend → Test Frontend → Deploy → Health Check
```

## 📊 Monitoring Setup

### Start Monitoring Services
```bash
cd monitoring
docker-compose up -d
```

### Access Dashboards
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001
  - Username: admin
  - Password: admin

### Configure Grafana
1. Add Prometheus data source: http://prometheus:9090
2. Import dashboard for container metrics
3. Create alerts for service health

## 🧪 Testing

### Backend Tests
```bash
cd backend
pip install -r requirements.txt
pytest test_app.py -v
```

### Frontend Tests
```bash
cd frontend
npm install
npm test
```

### Integration Tests
```bash
cd tests
./integration-test.sh
```

## 📦 Docker Commands

### Build Services
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build frontend
docker-compose build backend
```

### Manage Services
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart service
docker-compose restart backend
```

### Cleanup
```bash
# Remove containers and networks
docker-compose down

# Remove volumes too
docker-compose down -v

# Clean up Docker system
docker system prune -a
```

## 🔄 Deployment Strategy

### Blue-Green Deployment
The pipeline implements zero-downtime deployment:

1. **Build Phase**: New containers are built with version tags
2. **Test Phase**: Automated tests run on new builds
3. **Deploy Phase**: 
   - Old containers keep running
   - New containers start
   - Health checks verify new deployment
   - Traffic switches to new containers
   - Old containers shut down
4. **Rollback**: If health checks fail, automatically revert to previous version

### Manual Rollback
```bash
# Stop current deployment
docker-compose down

# Start previous version
docker-compose up -d
```

## 📁 Project Structure

```
devops-todo-app/
├── frontend/               # React frontend
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── backend/                # Flask backend
│   ├── app.py
│   ├── test_app.py
│   ├── Dockerfile
│   └── requirements.txt
├── jenkins/                # Jenkins setup
│   ├── Dockerfile
│   └── docker-compose.yml
├── monitoring/             # Monitoring stack
│   ├── docker-compose.yml
│   └── prometheus.yml
├── tests/                  # Integration tests
│   └── integration-test.sh
├── docker-compose.yml      # Main compose file
├── Jenkinsfile            # CI/CD pipeline
└── README.md
```

## 🔐 Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend
```
FLASK_ENV=production
```

## 🐛 Troubleshooting

### Services Not Starting
```bash
# Check Docker status
docker ps -a

# View logs
docker-compose logs

# Restart services
docker-compose restart
```

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :5000

# Kill the process or change port in docker-compose.yml
```

### Database Issues
```bash
# Remove volume and restart
docker-compose down -v
docker-compose up -d
```

### Jenkins Build Fails
1. Check Jenkins logs: `docker logs jenkins-server`
2. Verify Docker socket access
3. Ensure sufficient disk space
4. Check port conflicts

## 📈 Performance Tips

1. **Resource Allocation**: Increase Docker memory to 4GB
2. **Build Cache**: Use `--no-cache` flag for clean builds
3. **Log Management**: Regularly clean up logs
4. **Volume Cleanup**: Remove unused volumes periodically

## 🔒 Security Considerations

1. Change default Grafana credentials
2. Use environment variables for sensitive data
3. Implement proper authentication in production
4. Use secrets management for API keys
5. Regular security updates for base images

## 📝 API Documentation

### Endpoints

#### Health Check
```
GET /api/health
Response: {"status": "healthy", "timestamp": "...", "service": "todo-backend"}
```

#### Get All Todos
```
GET /api/todos
Response: [{"id": 1, "title": "Task", "completed": false, "created_at": "..."}]
```

#### Create Todo
```
POST /api/todos
Body: {"title": "New Task", "completed": false}
Response: {"id": 1, "title": "New Task", "completed": false, "created_at": "..."}
```

#### Update Todo
```
PUT /api/todos/{id}
Body: {"title": "Updated", "completed": true}
Response: {"id": 1, "title": "Updated", "completed": true, "created_at": "..."}
```

#### Delete Todo
```
DELETE /api/todos/{id}
Response: {"message": "Todo deleted successfully"}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

This project is created for educational purposes as part of a DevOps course assignment.

## 👥 Team Members

- [Add your team member names here]

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Contact: [your-email@example.com]

## 🎓 Learning Resources

- [Docker Documentation](https://docs.docker.com/)
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [DevOps Best Practices](https://www.atlassian.com/devops)

---

**Project Status**: ✅ Ready for Deployment

Last Updated: December 2024
