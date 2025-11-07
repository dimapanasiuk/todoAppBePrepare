import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Fab,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { useTaskStore } from './store/taskStore';
import { useAuthStore } from './store/authStore';
import { Task } from './types/Task';

function App() {
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  } = useTaskStore();
  
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated, fetchTasks]);

  const handleCreateTask = async (dto: { title: string; description?: string }) => {
    await createTask(dto);
  };

  const handleUpdateTask = async (dto: { title: string; description?: string }) => {
    if (editingTask) {
      await updateTask(editingTask.id, dto);
      setEditingTask(null);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingTask(null);
  };

  const handleLogout = () => {
    logout();
    setFormOpen(false);
    setEditingTask(null);
  };

  // Show auth forms if not authenticated
  if (!isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Todo App
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="sm">
          {showRegister ? (
            <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
          ) : (
            <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
          )}
        </Container>
      </Box>
    );
  }

  // Show tasks if authenticated
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todo App
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.username}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout} title="Выйти">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Мои задачи
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Добавить
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={toggleTaskCompletion}
            onDelete={deleteTask}
            onEdit={handleEdit}
          />
        )}

        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16, display: { sm: 'none' } }}
          onClick={() => setFormOpen(true)}
        >
          <AddIcon />
        </Fab>

        <TaskForm
          open={formOpen}
          onClose={handleCloseForm}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          editTask={editingTask}
        />
      </Container>
    </Box>
  );
}

export default App;
