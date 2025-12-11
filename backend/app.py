from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

DATABASE = '/data/todos.db'

def get_db():
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db

def init_db():
    os.makedirs(os.path.dirname(DATABASE), exist_ok=True)
    db = get_db()
    db.execute('''
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT 0,
            due_date TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    # Add due_date column if it doesn't exist (for existing databases)
    try:
        db.execute('ALTER TABLE todos ADD COLUMN due_date TEXT')
    except sqlite3.OperationalError:
        pass  # Column already exists
    db.commit()
    db.close()

# Initialize database on startup
init_db()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'todo-backend'
    }), 200

@app.route('/api/todos', methods=['GET'])
def get_todos():
    try:
        db = get_db()
        todos = db.execute('SELECT * FROM todos ORDER BY created_at DESC').fetchall()
        db.close()
        
        return jsonify([dict(todo) for todo in todos]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/todos', methods=['POST'])
def create_todo():
    try:
        data = request.get_json()
        
        if not data or 'title' not in data:
            return jsonify({'error': 'Title is required'}), 400
        
        db = get_db()
        cursor = db.execute(
            'INSERT INTO todos (title, completed, due_date) VALUES (?, ?, ?)',
            (data['title'], data.get('completed', False), data.get('due_date'))
        )
        db.commit()
        
        todo_id = cursor.lastrowid
        todo = db.execute('SELECT * FROM todos WHERE id = ?', (todo_id,)).fetchone()
        db.close()
        
        return jsonify(dict(todo)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    try:
        data = request.get_json()
        db = get_db()
        
        # Check if todo exists
        todo = db.execute('SELECT * FROM todos WHERE id = ?', (todo_id,)).fetchone()
        if not todo:
            db.close()
            return jsonify({'error': 'Todo not found'}), 404
        
        # Update todo
        db.execute(
            'UPDATE todos SET title = ?, completed = ?, due_date = ? WHERE id = ?',
            (
                data.get('title', todo['title']),
                data.get('completed', todo['completed']),
                data.get('due_date', todo.get('due_date')),
                todo_id
            )
        )
        db.commit()
        
        updated_todo = db.execute('SELECT * FROM todos WHERE id = ?', (todo_id,)).fetchone()
        db.close()
        
        return jsonify(dict(updated_todo)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    try:
        db = get_db()
        
        # Check if todo exists
        todo = db.execute('SELECT * FROM todos WHERE id = ?', (todo_id,)).fetchone()
        if not todo:
            db.close()
            return jsonify({'error': 'Todo not found'}), 404
        
        db.execute('DELETE FROM todos WHERE id = ?', (todo_id,))
        db.commit()
        db.close()
        
        return jsonify({'message': 'Todo deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
