import React, { useEffect, useReducer, useCallback, useState } from 'react';
import axios from 'axios';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, tasks: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    default:
      return state;
  }
}
const PORT = process.env.REACT_APP_BACKEND_PORT;
console.log('PORT:', process.env.REACT_APP_BACKEND_PORT);

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [newTask, setNewTask] = useState('');

  const fetchTasks = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await axios.get(`http://localhost:${PORT}/tasks`);
      console.log('Response:', res.data);
      dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    const task = { id: Date.now(), title: newTask };
    try {
      await axios.post(`http://localhost:${PORT}/tasks`, task);
      setNewTask('');
      fetchTasks(); 
    } catch (err) {
      alert('Failed to add task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:${PORT}/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Task Manager</h1>
      {state.loading && <p>Loading tasks...</p>}
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
      <input
        value={newTask}
        onChange={e => setNewTask(e.target.value)}
        placeholder="New Task"
      />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {state.tasks.map(task => (
          <li key={task.id}>
            {task.title}
            <button onClick={() => handleDelete(task.id)} style={{ marginLeft: '1rem' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
