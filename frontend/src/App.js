import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Navigation Component
function Navigation({ currentPage, setCurrentPage }) {
  const pages = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'todos', label: 'All Tasks', icon: '📋' },
    { id: 'current', label: 'Current', icon: '⏳' },
    { id: 'due', label: 'Due Tasks', icon: '📅' },
    { id: 'completed', label: 'Completed', icon: '✅' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'about', label: 'About', icon: 'ℹ️' }
  ];
  
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="logo">📝</span>
        <span className="brand-text">DevOps Todo</span>
      </div>
      <div className="nav-links">
        {pages.map(page => (
          <button
            key={page.id}
            className={`nav-link ${currentPage === page.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(page.id)}
            title={page.label}
          >
            <span className="nav-icon">{page.icon}</span>
            <span className="nav-label">{page.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// Dashboard Component
function Dashboard({ todos }) {
  const totalTodos = todos.length;
  const completedTodos = todos.filter(t => t.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  const completionRate = totalTodos > 0 ? ((completedTodos / totalTodos) * 100).toFixed(1) : 0;

  const stats = [
    { label: 'Total Tasks', value: totalTodos, icon: '📋', color: '#667eea' },
    { label: 'Completed', value: completedTodos, icon: '✅', color: '#48bb78' },
    { label: 'Pending', value: pendingTodos, icon: '⏳', color: '#f6ad55' },
    { label: 'Completion Rate', value: `${completionRate}%`, icon: '📊', color: '#9f7aea' }
  ];

  return (
    <div className="dashboard">
      <h2 className="page-title">Dashboard Overview</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="recent-activity">
        <h3>Recent Tasks</h3>
        <div className="activity-list">
          {todos.slice(0, 5).map(todo => (
            <div key={todo.id} className="activity-item">
              <span className={`activity-status ${todo.completed ? 'completed' : 'pending'}`}>
                {todo.completed ? '✓' : '○'}
              </span>
              <span className="activity-text">{todo.title}</span>
              <span className="activity-time">{new Date(todo.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Todos Component with Categories
function TodosPage({ todos, setTodos, error, setError }) {
  const [newTodo, setNewTodo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/todos`, {
        title: newTodo,
        completed: false,
        due_date: dueDate || null
      });
      setTodos([response.data, ...todos]);
      setNewTodo('');
      setDueDate('');
      setError('');
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/todos/${id}`, { completed: !completed });
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));
      setError('');
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const deleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
    setEditDueDate(todo.due_date || '');
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    
    try {
      await axios.put(`${API_URL}/todos/${id}`, { 
        title: editText,
        due_date: editDueDate || null
      });
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, title: editText, due_date: editDueDate || null } : todo
      ));
      setEditingId(null);
      setEditDueDate('');
      setError('');
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const clearCompleted = async () => {
    const completedIds = todos.filter(t => t.completed).map(t => t.id);
    if (completedIds.length === 0) return;
    
    if (!window.confirm(`Delete ${completedIds.length} completed tasks?`)) return;
    
    try {
      await Promise.all(completedIds.map(id => axios.delete(`${API_URL}/todos/${id}`)));
      setTodos(todos.filter(todo => !todo.completed));
      setError('');
    } catch (err) {
      setError('Failed to clear completed todos');
    }
  };

  const filteredTodos = todos
    .filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    })
    .filter(todo => 
      todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="todos-page">
      <h2 className="page-title">My Tasks</h2>
      
      {error && <div className="error-banner">{error}</div>}
      
      <div className="todo-controls">
        <form onSubmit={addTodo} className="todo-form-enhanced">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className="todo-input-enhanced"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="todo-date-input"
            title="Due Date (Optional)"
          />
          <button type="submit" className="add-btn-enhanced">
            <span>➕</span> Add Task
          </button>
        </form>

        <div className="filter-search">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search tasks..."
            className="search-input"
          />
          
          <div className="filter-buttons">
            {['all', 'active', 'completed'].map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          
          {todos.filter(t => t.completed).length > 0 && (
            <button className="clear-btn" onClick={clearCompleted}>
              Clear Completed
            </button>
          )}
        </div>
      </div>

      <div className="todo-list-enhanced">
        {filteredTodos.length === 0 ? (
          <div className="empty-state-enhanced">
            <div className="empty-icon">📭</div>
            <p className="empty-text">No tasks found</p>
            <p className="empty-subtext">
              {searchTerm ? 'Try a different search term' : 'Add your first task above!'}
            </p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div key={todo.id} className={`todo-item-enhanced ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
                className="todo-checkbox"
              />
              
              {editingId === todo.id ? (
                <div className="todo-edit-container">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => saveEdit(todo.id)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                    className="todo-edit-input"
                    autoFocus
                  />
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="todo-edit-date"
                    onBlur={() => saveEdit(todo.id)}
                  />
                </div>
              ) : (
                <div className="todo-content">
                  <span 
                    className="todo-title-enhanced"
                    onDoubleClick={() => startEdit(todo)}
                  >
                    {todo.title}
                  </span>
                  {todo.due_date && (
                    <span className={`todo-due-date ${new Date(todo.due_date) < new Date() && !todo.completed ? 'overdue' : ''}`}>
                      📅 {new Date(todo.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
              
              <div className="todo-actions">
                <button 
                  onClick={() => startEdit(todo)}
                  className="edit-btn"
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-btn-enhanced"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="todo-footer">
        <span>{filteredTodos.length} {filteredTodos.length === 1 ? 'task' : 'tasks'}</span>
      </div>
    </div>
  );
}

// Completed Tasks Page Component
function CompletedTasksPage({ todos, setTodos, error, setError }) {
  const completedTodos = todos.filter(t => t.completed);
  const [searchTerm, setSearchTerm] = useState('');

  const deleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/todos/${id}`, { completed: !completed });
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));
      setError('');
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const filteredTodos = completedTodos.filter(todo => 
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="todos-page">
      <h2 className="page-title">✅ Completed Tasks</h2>
      
      {error && <div className="error-banner">{error}</div>}
      
      <div className="todo-controls">
        <div className="filter-search">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search completed tasks..."
            className="search-input"
          />
        </div>
      </div>

      <div className="todo-list-enhanced">
        {filteredTodos.length === 0 ? (
          <div className="empty-state-enhanced">
            <div className="empty-icon">✅</div>
            <p className="empty-text">No completed tasks found</p>
            <p className="empty-subtext">
              {searchTerm ? 'Try a different search term' : 'Complete some tasks to see them here!'}
            </p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div key={todo.id} className="todo-item-enhanced completed">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
                className="todo-checkbox"
              />
              
              <div className="todo-content">
                <span className="todo-title-enhanced">{todo.title}</span>
                {todo.due_date && (
                  <span className="todo-due-date">
                    📅 {new Date(todo.due_date).toLocaleDateString()}
                  </span>
                )}
                <span className="todo-completed-date">
                  Completed: {new Date(todo.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="todo-actions">
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-btn-enhanced"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="todo-footer">
        <span>{filteredTodos.length} completed {filteredTodos.length === 1 ? 'task' : 'tasks'}</span>
      </div>
    </div>
  );
}

// Due Tasks Page Component
function DueTasksPage({ todos, setTodos, error, setError }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueTodos = todos.filter(t => {
    if (!t.due_date || t.completed) return false;
    const dueDate = new Date(t.due_date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate <= today;
  }).sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  const [searchTerm, setSearchTerm] = useState('');

  const deleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/todos/${id}`, { completed: !completed });
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));
      setError('');
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const filteredTodos = dueTodos.filter(todo => 
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="todos-page">
      <h2 className="page-title">📅 Due Tasks</h2>
      
      {error && <div className="error-banner">{error}</div>}
      
      {dueTodos.length > 0 && (
        <div className="warning-banner">
          ⚠️ You have {dueTodos.length} {dueTodos.length === 1 ? 'task' : 'tasks'} that {dueTodos.length === 1 ? 'is' : 'are'} due or overdue!
        </div>
      )}
      
      <div className="todo-controls">
        <div className="filter-search">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search due tasks..."
            className="search-input"
          />
        </div>
      </div>

      <div className="todo-list-enhanced">
        {filteredTodos.length === 0 ? (
          <div className="empty-state-enhanced">
            <div className="empty-icon">📅</div>
            <p className="empty-text">No due tasks found</p>
            <p className="empty-subtext">
              {searchTerm ? 'Try a different search term' : 'Great! You have no overdue tasks!'}
            </p>
          </div>
        ) : (
          filteredTodos.map(todo => {
            const dueDate = new Date(todo.due_date);
            dueDate.setHours(0, 0, 0, 0);
            const isOverdue = dueDate < today;
            
            return (
              <div key={todo.id} className={`todo-item-enhanced ${isOverdue ? 'overdue' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id, todo.completed)}
                  className="todo-checkbox"
                />
                
                <div className="todo-content">
                  <span className="todo-title-enhanced">{todo.title}</span>
                  <span className={`todo-due-date ${isOverdue ? 'overdue' : ''}`}>
                    {isOverdue ? '🔴' : '📅'} {new Date(todo.due_date).toLocaleDateString()}
                    {isOverdue && <span className="overdue-badge">OVERDUE</span>}
                  </span>
                </div>
                
                <div className="todo-actions">
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-btn-enhanced"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="todo-footer">
        <span>{filteredTodos.length} due {filteredTodos.length === 1 ? 'task' : 'tasks'}</span>
      </div>
    </div>
  );
}

// Current Tasks Page Component
function CurrentTasksPage({ todos, setTodos, error, setError }) {
  const currentTodos = todos.filter(t => !t.completed);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  const deleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/todos/${id}`, { completed: !completed });
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));
      setError('');
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
    setEditDueDate(todo.due_date || '');
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    
    try {
      await axios.put(`${API_URL}/todos/${id}`, { 
        title: editText,
        due_date: editDueDate || null
      });
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, title: editText, due_date: editDueDate || null } : todo
      ));
      setEditingId(null);
      setEditDueDate('');
      setError('');
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const filteredTodos = currentTodos.filter(todo => 
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="todos-page">
      <h2 className="page-title">⏳ Current Tasks</h2>
      
      {error && <div className="error-banner">{error}</div>}
      
      <div className="todo-controls">
        <div className="filter-search">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search current tasks..."
            className="search-input"
          />
        </div>
      </div>

      <div className="todo-list-enhanced">
        {filteredTodos.length === 0 ? (
          <div className="empty-state-enhanced">
            <div className="empty-icon">🎉</div>
            <p className="empty-text">No current tasks!</p>
            <p className="empty-subtext">
              {searchTerm ? 'Try a different search term' : 'All caught up! Great job!'}
            </p>
          </div>
        ) : (
          filteredTodos.map(todo => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dueDate = todo.due_date ? new Date(todo.due_date) : null;
            const isOverdue = dueDate && dueDate < today;
            
            return (
              <div key={todo.id} className={`todo-item-enhanced ${isOverdue ? 'overdue' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id, todo.completed)}
                  className="todo-checkbox"
                />
                
                {editingId === todo.id ? (
                  <div className="todo-edit-container">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={() => saveEdit(todo.id)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                      className="todo-edit-input"
                      autoFocus
                    />
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="todo-edit-date"
                      onBlur={() => saveEdit(todo.id)}
                    />
                  </div>
                ) : (
                  <div className="todo-content">
                    <span 
                      className="todo-title-enhanced"
                      onDoubleClick={() => startEdit(todo)}
                    >
                      {todo.title}
                    </span>
                    {todo.due_date && (
                      <span className={`todo-due-date ${isOverdue ? 'overdue' : ''}`}>
                        {isOverdue ? '🔴' : '📅'} {new Date(todo.due_date).toLocaleDateString()}
                        {isOverdue && <span className="overdue-badge">OVERDUE</span>}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="todo-actions">
                  <button 
                    onClick={() => startEdit(todo)}
                    className="edit-btn"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-btn-enhanced"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="todo-footer">
        <span>{filteredTodos.length} current {filteredTodos.length === 1 ? 'task' : 'tasks'}</span>
      </div>
    </div>
  );
}

// Analytics Component
function Analytics({ todos }) {
  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="analytics-page">
      <h2 className="page-title">Analytics & Insights</h2>
      
      <div className="analytics-grid">
        <div className="chart-card">
          <h3>Task Status Distribution</h3>
          <div className="pie-chart">
            <div className="pie-segment completed" style={{ 
              background: `conic-gradient(#48bb78 0deg ${(completedTasks/totalTasks)*360}deg, #f6ad55 ${(completedTasks/totalTasks)*360}deg 360deg)` 
            }}>
              <div className="pie-center">
                <div className="pie-value">{totalTasks}</div>
                <div className="pie-label">Total</div>
              </div>
            </div>
            <div className="legend">
              <div className="legend-item">
                <span className="legend-color" style={{ background: '#48bb78' }}></span>
                <span>Completed ({completedTasks})</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ background: '#f6ad55' }}></span>
                <span>Pending ({pendingTasks})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Productivity Metrics</h3>
          <div className="metrics-list">
            <div className="metric-row">
              <span className="metric-label">Completion Rate</span>
              <div className="metric-bar">
                <div 
                  className="metric-fill" 
                  style={{ width: `${totalTasks > 0 ? (completedTasks/totalTasks)*100 : 0}%` }}
                ></div>
              </div>
              <span className="metric-value">
                {totalTasks > 0 ? ((completedTasks/totalTasks)*100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Active Tasks</span>
              <div className="metric-bar">
                <div 
                  className="metric-fill active" 
                  style={{ width: `${totalTasks > 0 ? (pendingTasks/totalTasks)*100 : 0}%` }}
                ></div>
              </div>
              <span className="metric-value">{pendingTasks}</span>
            </div>
          </div>
        </div>

        <div className="chart-card full-width">
          <h3>Task Details</h3>
          <div className="details-table">
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Task</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {todos.slice(0, 10).map(todo => (
                  <tr key={todo.id}>
                    <td>
                      <span className={`status-badge ${todo.completed ? 'completed' : 'pending'}`}>
                        {todo.completed ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                    <td>{todo.title}</td>
                    <td>{new Date(todo.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// About Component
function About() {
  return (
    <div className="about-page">
      <h2 className="page-title">About This Project</h2>
      
      <div className="about-content">
        <div className="about-card">
          <h3>🚀 DevOps CI/CD Pipeline</h3>
          <p>
            This is a comprehensive DevOps project demonstrating modern CI/CD practices using
            industry-standard tools and technologies.
          </p>
        </div>

        <div className="about-card">
          <h3>🏗️ Architecture</h3>
          <div className="tech-stack">
            <div className="tech-item">
              <strong>Frontend:</strong> React.js with modern hooks
            </div>
            <div className="tech-item">
              <strong>Backend:</strong> Python Flask REST API
            </div>
            <div className="tech-item">
              <strong>Database:</strong> SQLite with persistent storage
            </div>
            <div className="tech-item">
              <strong>Containerization:</strong> Docker & Docker Compose
            </div>
            <div className="tech-item">
              <strong>CI/CD:</strong> Jenkins Pipeline
            </div>
            <div className="tech-item">
              <strong>Monitoring:</strong> Prometheus & Grafana
            </div>
          </div>
        </div>

        <div className="about-card">
          <h3>✅ Features</h3>
          <ul className="features-list">
            <li>✓ Multi-page responsive interface</li>
            <li>✓ Real-time dashboard with statistics</li>
            <li>✓ Advanced task management (edit, search, filter)</li>
            <li>✓ Analytics and insights</li>
            <li>✓ Automated CI/CD pipeline</li>
            <li>✓ Blue-Green deployment strategy</li>
            <li>✓ Comprehensive monitoring</li>
            <li>✓ Automated testing suite</li>
          </ul>
        </div>

        <div className="about-card">
          <h3>📊 DevOps Requirements</h3>
          <div className="requirements-grid">
            <div className="requirement-item">
              <span className="req-number">1</span>
              <span>Git, Jenkins, Docker</span>
            </div>
            <div className="requirement-item">
              <span className="req-number">2</span>
              <span>Multiple Microservices</span>
            </div>
            <div className="requirement-item">
              <span className="req-number">3</span>
              <span>Automated Testing</span>
            </div>
            <div className="requirement-item">
              <span className="req-number">4</span>
              <span>Minimal Downtime</span>
            </div>
            <div className="requirement-item">
              <span className="req-number">5</span>
              <span>Monitoring & Logging</span>
            </div>
            <div className="requirement-item">
              <span className="req-number">6</span>
              <span>Rollback Process</span>
            </div>
            <div className="requirement-item">
              <span className="req-number">7</span>
              <span>Documentation</span>
            </div>
          </div>
        </div>

        <div className="about-card">
          <h3>🎓 Project Info</h3>
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Status:</strong> Production Ready</p>
          <p><strong>License:</strong> Educational Purpose</p>
          <p><strong>Last Updated:</strong> December 2024</p>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
      setError('');
    } catch (err) {
      setError('Failed to connect to backend');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <div className="main-content">
        {loading ? (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {currentPage === 'dashboard' && <Dashboard todos={todos} />}
            {currentPage === 'todos' && (
              <TodosPage 
                todos={todos} 
                setTodos={setTodos} 
                error={error} 
                setError={setError} 
              />
            )}
            {currentPage === 'current' && (
              <CurrentTasksPage 
                todos={todos} 
                setTodos={setTodos} 
                error={error} 
                setError={setError} 
              />
            )}
            {currentPage === 'due' && (
              <DueTasksPage 
                todos={todos} 
                setTodos={setTodos} 
                error={error} 
                setError={setError} 
              />
            )}
            {currentPage === 'completed' && (
              <CompletedTasksPage 
                todos={todos} 
                setTodos={setTodos} 
                error={error} 
                setError={setError} 
              />
            )}
            {currentPage === 'analytics' && <Analytics todos={todos} />}
            {currentPage === 'about' && <About />}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
