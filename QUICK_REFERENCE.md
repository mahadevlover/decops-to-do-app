# Quick Reference Card - DevOps Todo App

## 🚀 Essential Commands

### Start Application
```bash
./start.sh
```

### Stop Application
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

### Run Tests
```bash
cd tests && ./integration-test.sh
```

### Verify Setup
```bash
./verify-setup.sh
```

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/api/health |
| Jenkins | http://localhost:8080 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3001 |

---

## 📋 API Endpoints

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Get Todos
```bash
curl http://localhost:5000/api/todos
```

### Create Todo
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","completed":false}'
```

### Update Todo
```bash
curl -X PUT http://localhost:5000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

### Delete Todo
```bash
curl -X DELETE http://localhost:5000/api/todos/1
```

---

## 🐛 Quick Troubleshooting

### Port in Use
```bash
# Check what's using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Rebuild Everything
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### View Container Status
```bash
docker-compose ps
```

### Enter Container
```bash
docker exec -it todo-backend /bin/sh
docker exec -it todo-frontend /bin/sh
```

---

## 📁 File Locations

- **Frontend Code**: `frontend/src/`
- **Backend Code**: `backend/app.py`
- **Pipeline**: `Jenkinsfile`
- **Docker Config**: `docker-compose.yml`
- **Tests**: `tests/integration-test.sh`
- **Docs**: `docs/`

---

## ✅ Requirements Met

1. ✅ Git, Jenkins, Docker
2. ✅ Multiple microservices
3. ✅ Automated testing
4. ✅ Minimal downtime
5. ✅ Monitoring & logging
6. ✅ Rollback process
7. ✅ Documentation

---

## 🎯 Demo Flow

1. Run `./verify-setup.sh`
2. Run `./start.sh`
3. Open http://localhost:3000
4. Add/complete/delete todos
5. Run `./tests/integration-test.sh`
6. Show Jenkins at http://localhost:8080
7. Show monitoring at http://localhost:9090

---

## 📞 Quick Help

**Setup Issues**: Check `DEPLOYMENT.md`  
**Project Info**: Check `README.md`  
**Summary**: Check `docs/PROJECT_SUMMARY.md`

---

**Remember**: All services must be running before testing!
