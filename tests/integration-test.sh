#!/bin/bash

echo "====================================="
echo "Running Integration Tests"
echo "====================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to run a test
run_test() {
    local test_name=$1
    local test_command=$2
    
    echo -n "Testing: $test_name ... "
    
    if eval $test_command > /dev/null 2>&1; then
        echo -e "${GREEN}PASSED${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}FAILED${NC}"
        ((FAILED++))
        return 1
    fi
}

echo ""
echo "1. Backend Health Check"
run_test "Backend API Health" "curl -f http://localhost:5000/api/health"

echo ""
echo "2. Frontend Health Check"
run_test "Frontend Availability" "curl -f http://localhost:3000"

echo ""
echo "3. API Endpoints Testing"
run_test "GET /api/todos" "curl -f http://localhost:5000/api/todos"

# Create a todo
TODO_RESPONSE=$(curl -s -X POST http://localhost:5000/api/todos \
    -H "Content-Type: application/json" \
    -d '{"title":"Test Todo","completed":false}')

if [ $? -eq 0 ]; then
    echo -e "Testing: POST /api/todos ... ${GREEN}PASSED${NC}"
    ((PASSED++))
    
    # Extract todo ID
    TODO_ID=$(echo $TODO_RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
    
    if [ ! -z "$TODO_ID" ]; then
        # Test UPDATE
        run_test "PUT /api/todos/$TODO_ID" "curl -f -X PUT http://localhost:5000/api/todos/$TODO_ID -H 'Content-Type: application/json' -d '{\"completed\":true}'"
        
        # Test DELETE
        run_test "DELETE /api/todos/$TODO_ID" "curl -f -X DELETE http://localhost:5000/api/todos/$TODO_ID"
    fi
else
    echo -e "Testing: POST /api/todos ... ${RED}FAILED${NC}"
    ((FAILED++))
fi

echo ""
echo "4. Container Health Checks"
run_test "Backend Container Running" "docker ps | grep todo-backend"
run_test "Frontend Container Running" "docker ps | grep todo-frontend"

echo ""
echo "====================================="
echo "Test Summary"
echo "====================================="
echo -e "Tests Passed: ${GREEN}$PASSED${NC}"
echo -e "Tests Failed: ${RED}$FAILED${NC}"
echo "====================================="

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed!${NC}"
    exit 1
fi
