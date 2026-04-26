import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Card, CardContent, Grid, TextField, MenuItem,
  Button, CircularProgress, Typography, Divider,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import toast from 'react-hot-toast';
import api from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import { LEAD_STATUSES } from '../../utils/helpers';

const EMPTY_FORM = {
  name: '', email: '', phone: '', status: 'New',
  assignedTo: '', company: '',
};

const LeadFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // Fetch existing lead for edit
  const { data: leadData, isLoading: loadingLead } = useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const { data } = await api.get(`/leads/${id}`);
      return data.data;
    },
    enabled: isEdit,
  });

  // Fetch users for dropdown
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users');
      return data.data;
    },
  });

  // Fetch companies for dropdown
  const { data: companiesData } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data } = await api.get('/companies');
      return data.data;
    },
  });

  useEffect(() => {
    if (leadData) {
      setForm({
        name: leadData.name || '',
        email: leadData.email || '',
        phone: leadData.phone || '',
        status: leadData.status || 'New',
        assignedTo: leadData.assignedTo?._id || '',
        company: leadData.company?._id || '',
      });
    }
  }, [leadData]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    return errs;
  };

  const mutation = useMutation({
    mutationFn: (payload) =>
      isEdit ? api.put(`/leads/${id}`, payload) : api.post('/leads', payload),
    onSuccess: () => {
      toast.success(isEdit ? 'Lead updated!' : 'Lead created!');
      queryClient.invalidateQueries(['leads']);
      queryClient.invalidateQueries(['dashboard-stats']);
      navigate('/leads');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const payload = { ...form };
    if (!payload.assignedTo) delete payload.assignedTo;
    if (!payload.company) delete payload.company;
    mutation.mutate(payload);
  };

  if (isEdit && loadingLead) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }

  return (
    <Box className="page-enter">
      <PageHeader
        title={isEdit ? 'Edit Lead' : 'Add New Lead'}
        breadcrumbs={[
          { label: 'Leads', path: '/leads' },
          { label: isEdit ? 'Edit Lead' : 'New Lead' },
        ]}
      />

      <Card sx={{ maxWidth: 720, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  select
                  fullWidth
                  required
                >
                  {LEAD_STATUSES.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Assign To"
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  select
                  fullWidth
                >
                  <MenuItem value="">— Unassigned —</MenuItem>
                  {(usersData || []).map((u) => (
                    <MenuItem key={u._id} value={u._id}>{u.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Company"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  select
                  fullWidth
                >
                  <MenuItem value="">— No Company —</MenuItem>
                  {(companiesData || []).map((c) => (
                    <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => navigate('/leads')}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={mutation.isPending ? <CircularProgress size={16} color="inherit" /> : <Save />}
                disabled={mutation.isPending}
                sx={{
                  background: 'linear-gradient(135deg, #e94560, #c73652)',
                  '&:hover': { background: 'linear-gradient(135deg, #c73652, #a52d43)' },
                }}
              >
                {mutation.isPending ? 'Saving...' : isEdit ? 'Update Lead' : 'Create Lead'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LeadFormPage;
