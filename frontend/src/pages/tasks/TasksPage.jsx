import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Typography, Skeleton, IconButton,
  Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Grid, CircularProgress, Chip,
} from '@mui/material';
import { Add, Edit, Delete, CheckCircle, Save, Cancel } from '@mui/icons-material';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { TASK_STATUSES, formatDate } from '../../utils/helpers';

const EMPTY_FORM = { title: '', description: '', lead: '', assignedTo: '', dueDate: '', status: 'Pending' };

const TaskFormDialog = ({ open, onClose, editTask }) => {
  const queryClient = useQueryClient();
  const isEdit = Boolean(editTask);
  const [form, setForm] = useState(editTask || EMPTY_FORM);

  React.useEffect(() => {
    setForm(editTask
      ? {
          title: editTask.title || '',
          description: editTask.description || '',
          lead: editTask.lead?._id || '',
          assignedTo: editTask.assignedTo?._id || '',
          dueDate: editTask.dueDate ? editTask.dueDate.split('T')[0] : '',
          status: editTask.status || 'Pending',
        }
      : EMPTY_FORM
    );
  }, [editTask, open]);

  const { data: leadsData } = useQuery({
    queryKey: ['leads-dropdown'],
    queryFn: async () => {
      const { data } = await api.get('/leads', { params: { limit: 100 } });
      return data.data;
    },
    enabled: open,
  });

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users');
      return data.data;
    },
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: (payload) =>
      isEdit ? api.put(`/tasks/${editTask._id}`, payload) : api.post('/tasks', payload),
    onSuccess: () => {
      toast.success(isEdit ? 'Task updated!' : 'Task created!');
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['dashboard-stats']);
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Operation failed'),
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.lead || !form.assignedTo) {
      toast.error('Title, Lead and Assigned To are required');
      return;
    }
    mutation.mutate(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle fontWeight={700}>{isEdit ? 'Edit Task' : 'Create New Task'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Task Title" name="title" value={form.title} onChange={handleChange}
                fullWidth required size="small" />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" name="description" value={form.description}
                onChange={handleChange} fullWidth multiline rows={2} size="small" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Lead" name="lead" value={form.lead} onChange={handleChange}
                select fullWidth required size="small">
                <MenuItem value="">Select Lead</MenuItem>
                {(leadsData || []).map((l) => (
                  <MenuItem key={l._id} value={l._id}>{l.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Assign To" name="assignedTo" value={form.assignedTo}
                onChange={handleChange} select fullWidth required size="small">
                <MenuItem value="">Select User</MenuItem>
                {(usersData || []).map((u) => (
                  <MenuItem key={u._id} value={u._id}>{u.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Due Date" name="dueDate" type="date" value={form.dueDate}
                onChange={handleChange} fullWidth size="small" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Status" name="status" value={form.status} onChange={handleChange}
                select fullWidth size="small">
                {TASK_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} startIcon={<Cancel />} disabled={mutation.isPending}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={mutation.isPending}
          startIcon={mutation.isPending ? <CircularProgress size={16} color="inherit" /> : <Save />}
          sx={{ background: 'linear-gradient(135deg, #e94560, #c73652)' }}>
          {mutation.isPending ? 'Saving...' : isEdit ? 'Update' : 'Create Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const TasksPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await api.get('/tasks');
      return data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      toast.success('Task deleted');
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['dashboard-stats']);
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed'),
  });

  const quickStatusMutation = useMutation({
    mutationFn: ({ id, status }) => api.put(`/tasks/${id}`, { status }),
    onSuccess: () => {
      toast.success('Task marked as completed!');
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['dashboard-stats']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  });

  const tasks = data || [];

  const canUpdateTask = (task) =>
    user?.role === 'admin' || task.assignedTo?._id === user?._id;

  return (
    <Box className="page-enter">
      <PageHeader
        title="Tasks"
        subtitle={`${tasks.length} tasks`}
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => { setEditTask(null); setDialogOpen(true); }}
            sx={{
              background: 'linear-gradient(135deg, #e94560, #c73652)',
              boxShadow: '0 4px 15px rgba(233,69,96,0.3)',
              '&:hover': { transform: 'translateY(-1px)' },
              transition: 'all 0.2s',
            }}
          >
            Add Task
          </Button>
        }
      />

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Lead</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? [...Array(4)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(6)].map((_, j) => (
                        <TableCell key={j}><Skeleton /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : tasks.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">No tasks found</Typography>
                      </TableCell>
                    </TableRow>
                  )
                : tasks.map((task, i) => {
                    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';
                    return (
                      <TableRow
                        key={task._id}
                        sx={{
                          animation: `fadeInUp 0.3s ease both`,
                          animationDelay: `${i * 0.04}s`,
                          '&:hover': { background: '#f5f6fa' },
                          opacity: task.status === 'Completed' ? 0.7 : 1,
                          transition: 'background 0.15s',
                        }}
                      >
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}
                          >
                            {task.title}
                          </Typography>
                          {task.description && (
                            <Typography variant="caption" color="text.secondary">{task.description}</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{task.lead?.name || '—'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{task.assignedTo?.name || '—'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            color={isOverdue ? 'error.main' : 'text.secondary'}
                            fontWeight={isOverdue ? 600 : 400}
                          >
                            {formatDate(task.dueDate)}
                            {isOverdue && ' ⚠️'}
                          </Typography>
                        </TableCell>
                        <TableCell><StatusChip status={task.status} /></TableCell>
                        <TableCell align="center">
                          {/* Quick complete — only for assigned user or admin */}
                          {task.status !== 'Completed' && canUpdateTask(task) && (
                            <Tooltip title="Mark as Completed">
                              <IconButton
                                size="small"
                                onClick={() => quickStatusMutation.mutate({ id: task._id, status: 'Completed' })}
                                sx={{ color: 'success.main' }}
                              >
                                <CheckCircle fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {canUpdateTask(task) && (
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => { setEditTask(task); setDialogOpen(true); }}
                                sx={{ color: 'primary.main' }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {user?.role === 'admin' && (
                            <Tooltip title="Delete">
                              <IconButton size="small" onClick={() => setDeleteId(task._id)} sx={{ color: 'error.main' }}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <TaskFormDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditTask(null); }}
        editTask={editTask}
      />

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        onConfirm={() => deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
      />
    </Box>
  );
};

export default TasksPage;
