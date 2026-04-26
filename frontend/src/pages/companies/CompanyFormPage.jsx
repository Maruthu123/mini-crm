import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Card, CardContent, Grid, TextField,
  Button, CircularProgress, Divider,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import toast from 'react-hot-toast';
import api from '../../services/api';
import PageHeader from '../../components/common/PageHeader';

const CompanyFormPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', industry: '', location: '', website: '', phone: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Company name is required';
    return errs;
  };

  const mutation = useMutation({
    mutationFn: (payload) => api.post('/companies', payload),
    onSuccess: () => {
      toast.success('Company created!');
      queryClient.invalidateQueries(['companies']);
      navigate('/companies');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create company'),
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    mutation.mutate(form);
  };

  return (
    <Box className="page-enter">
      <PageHeader
        title="Add Company"
        breadcrumbs={[
          { label: 'Companies', path: '/companies' },
          { label: 'New Company' },
        ]}
      />
      <Card sx={{ maxWidth: 680, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField label="Company Name" name="name" value={form.name} onChange={handleChange}
                  fullWidth required error={!!errors.name} helperText={errors.name} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Industry" name="industry" value={form.industry} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Location" name="location" value={form.location} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Website" name="website" value={form.website} onChange={handleChange} fullWidth
                  placeholder="https://example.com" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" startIcon={<Cancel />} onClick={() => navigate('/companies')} disabled={mutation.isPending}>
                Cancel
              </Button>
              <Button
                type="submit" variant="contained"
                startIcon={mutation.isPending ? <CircularProgress size={16} color="inherit" /> : <Save />}
                disabled={mutation.isPending}
                sx={{ background: 'linear-gradient(135deg, #e94560, #c73652)', '&:hover': { background: 'linear-gradient(135deg, #c73652, #a52d43)' } }}
              >
                {mutation.isPending ? 'Creating...' : 'Create Company'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CompanyFormPage;
