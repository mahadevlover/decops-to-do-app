#!/bin/bash

echo "========================================"
echo "  DevOps Todo App - Quick Start Script"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Error: Docker is not installed${NC}"
    echo "Please install Docker Desktop first"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo -e "${YELLOW}Error: Docker Compose is not available${NC}"
    exit 1
fi

echo -e "${BLUE}1. Checking Docker status...${NC}"
if docker info > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Docker is running${NC}"
else
    echo -e "${YELLOW}Error: Docker is not running. Please start Docker Desktop.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}2. Stopping any existing containers...${NC}"
docker-compose down > /dev/null 2>&1
echo -e "${GREEN}✓ Cleanup complete${NC}"

echo ""
echo -e "${BLUE}3. Building Docker images...${NC}"
echo "This may take a few minutes on first run..."
docker-compose build --no-cache

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${YELLOW}Error: Build failed${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}4. Starting services...${NC}"
docker-compose up -d

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Services started${NC}"
else
    echo -e "${YELLOW}Error: Failed to start services${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}5. Waiting for services to be ready...${NC}"
sleep 10

# Check backend health
echo -n "Checking backend... "
for i in {1..10}; do
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Ready${NC}"
        break
    fi
    if [ $i -eq 10 ]; then
        echo -e "${YELLOW}Warning: Backend may not be ready${NC}"
    fi
    sleep 2
done

# Check frontend
echo -n "Checking frontend... "
for i in {1..10}; do
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Ready${NC}"
        break
    fi
    if [ $i -eq 10 ]; then
        echo -e "${YELLOW}Warning: Frontend may not be ready${NC}"
    fi
    sleep 2
done

echo ""
echo "========================================"
echo -e "${GREEN}  Application is running!${NC}"
echo "========================================"
echo ""
echo "Access your application at:"
echo -e "${BLUE}Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}Backend API:${NC} http://localhost:5000/api"
echo -e "${BLUE}Health Check:${NC} http://localhost:5000/api/health"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop the application:"
echo "  docker-compose down"
echo ""
echo "To run tests:"
echo "  cd tests && ./integration-test.sh"
echo ""
echo "========================================"
