import pytest
import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import app, init_db

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Test health check endpoint"""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'healthy'
    assert 'timestamp' in data

def test_get_todos_empty(client):
    """Test getting todos when none exist"""
    response = client.get('/api/todos')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)

def test_create_todo(client):
    """Test creating a new todo"""
    response = client.post('/api/todos',
                          data=json.dumps({'title': 'Test Todo', 'completed': False}),
                          content_type='application/json')
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['title'] == 'Test Todo'
    assert data['completed'] == False

def test_create_todo_without_title(client):
    """Test creating todo without title"""
    response = client.post('/api/todos',
                          data=json.dumps({'completed': False}),
                          content_type='application/json')
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data

def test_update_todo(client):
    """Test updating a todo"""
    # First create a todo
    response = client.post('/api/todos',
                          data=json.dumps({'title': 'Update Test', 'completed': False}),
                          content_type='application/json')
    todo_id = json.loads(response.data)['id']
    
    # Update it
    response = client.put(f'/api/todos/{todo_id}',
                         data=json.dumps({'title': 'Updated Todo', 'completed': True}),
                         content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['title'] == 'Updated Todo'
    assert data['completed'] == True

def test_delete_todo(client):
    """Test deleting a todo"""
    # First create a todo
    response = client.post('/api/todos',
                          data=json.dumps({'title': 'Delete Test', 'completed': False}),
                          content_type='application/json')
    todo_id = json.loads(response.data)['id']
    
    # Delete it
    response = client.delete(f'/api/todos/{todo_id}')
    assert response.status_code == 200
    
    # Verify it's deleted
    response = client.get('/api/todos')
    data = json.loads(response.data)
    todo_ids = [todo['id'] for todo in data]
    assert todo_id not in todo_ids
