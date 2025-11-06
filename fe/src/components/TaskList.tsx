import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Checkbox,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Task } from '../types/Task';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggle,
  onDelete,
  onEdit,
}) => {
  if (tasks.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Нет задач. Добавьте новую задачу!
        </Typography>
      </Paper>
    );
  }

  return (
    <List sx={{ width: '100%' }}>
      {tasks.map((task) => (
        <Paper key={task.id} sx={{ mb: 1 }}>
          <ListItem
            secondaryAction={
              <Box>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => onEdit(task)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDelete(task.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
            disablePadding
          >
            <ListItemButton onClick={() => onToggle(task.id)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={task.completed}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText
                primary={task.title}
                secondary={task.description}
                sx={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? 'text.secondary' : 'text.primary',
                }}
              />
            </ListItemButton>
          </ListItem>
        </Paper>
      ))}
    </List>
  );
};

