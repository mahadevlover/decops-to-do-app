#!/bin/bash

echo "========================================="
echo "  DevOps Todo App - Setup Verification"
echo "========================================="
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASS=0
FAIL=0

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $1 ${RED}(MISSING)${NC}"
        ((FAIL++))
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $1/ ${RED}(MISSING)${NC}"
        ((FAIL++))
    fi
}

echo -e "${BLUE}1. Checking Project Structure${NC}"
echo "-----------------------------------"
check_dir "frontend"
check_dir "backend"
check_dir "jenkins"
check_dir "monitoring"
check_dir "tests"
check_dir "docs"

echo ""
echo -e "${BLUE}2. Checking Configuration Files${NC}"
echo "-----------------------------------"
check_file "docker-compose.yml"
check_file "Jenkinsfile"
check_file "README.md"
check_file ".gitignore"
check_file "start.sh"

echo ""
echo -e "${BLUE}3. Checking Frontend Files${NC}"
echo "-----------------------------------"
check_file "frontend/Dockerfile"
check_file "frontend/package.json"
check_file "frontend/nginx.conf"
check_file "frontend/.env"
check_dir "frontend/src"
check_dir "frontend/public"
check_file "frontend/src/App.js"
check_file "frontend/src/index.js"
check_file "frontend/src/App.test.js"

echo ""
echo -e "${BLUE}4. Checking Backend Files${NC}"
echo "-----------------------------------"
check_file "backend/Dockerfile"
check_file "backend/app.py"
check_file "backend/test_app.py"
check_file "backend/requirements.txt"

echo ""
echo -e "${BLUE}5. Checking Jenkins Files${NC}"
echo "-----------------------------------"
check_file "jenkins/Dockerfile"
check_file "jenkins/docker-compose.yml"

echo ""
echo -e "${BLUE}6. Checking Monitoring Files${NC}"
echo "-----------------------------------"
check_file "monitoring/docker-compose.yml"
check_file "monitoring/prometheus.yml"

echo ""
echo -e "${BLUE}7. Checking Test Files${NC}"
echo "-----------------------------------"
check_file "tests/integration-test.sh"

echo ""
echo -e "${BLUE}8. Checking Documentation${NC}"
echo "-----------------------------------"
check_file "docs/DEPLOYMENT.md"

echo ""
echo -e "${BLUE}9. Checking Prerequisites${NC}"
echo "-----------------------------------"

# Check Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✓${NC} Docker installed: $DOCKER_VERSION"
    ((PASS++))
else
    echo -e "${RED}✗${NC} Docker not installed"
    ((FAIL++))
fi

# Check Docker Compose
if docker compose version &> /dev/null; then
    COMPOSE_VERSION=$(docker compose version)
    echo -e "${GREEN}✓${NC} Docker Compose installed: $COMPOSE_VERSION"
    ((PASS++))
else
    echo -e "${RED}✗${NC} Docker Compose not installed"
    ((FAIL++))
fi

# Check if Docker is running
if docker info &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker daemon is running"
    ((PASS++))
else
    echo -e "${RED}✗${NC} Docker daemon is not running"
    ((FAIL++))
fi

# Check Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✓${NC} Git installed: $GIT_VERSION"
    ((PASS++))
else
    echo -e "${RED}✗${NC} Git not installed"
    ((FAIL++))
fi

echo ""
echo -e "${BLUE}10. Checking Port Availability${NC}"
echo "-----------------------------------"

check_port() {
    if ! lsof -i:$1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} Port $1 is available"
        ((PASS++))
    else
        echo -e "${YELLOW}⚠${NC} Port $1 is in use"
    fi
}

check_port 3000
check_port 5000
check_port 8080
check_port 9090
check_port 3001

echo ""
echo "========================================="
echo "  Verification Summary"
echo "========================================="
echo -e "Passed: ${GREEN}$PASS${NC}"
echo -e "Failed: ${RED}$FAIL${NC}"
echo "========================================="

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Project is ready.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run: ./start.sh"
    echo "2. Open: http://localhost:3000"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Please fix the issues above.${NC}"
    echo ""
    exit 1
fi
