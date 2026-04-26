import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, MenuItem, Select, FormControl,
  InputLabel, Button, IconButton, Tooltip, Typography,
  Pagination, Chip, InputAdornment, Skeleton, Stack,
} from '@mui/material';
import {
  Add, Edit, Delete, Search, FilterList,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import api from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { LEAD_STATUSES, formatDate } from '../../utils/helpers';

const LeadsListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['leads', page, search, status],
    queryFn: async () => {
      const { data } = await api.get('/leads', {
        params: { page, limit: 10, search, status },
      });
      return data;
    },
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/leads/${id}`),
    onSuccess: () => {
      toast.success('Lead deleted successfully');
      queryClient.invalidateQueries(['leads']);
      queryClient.invalidateQueries(['dashboard-stats']);
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed'),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const leads = data?.data || [];
  const pagination = data?.pagination;

  return (
    <Box className="page-enter">
      <PageHeader
        title="Leads"
        subtitle={`${pagination?.total || 0} total leads`}
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/leads/new')}
            sx={{
              background: 'linear-gradient(135deg, #e94560, #c73652)',
              boxShadow: '0 4px 15px rgba(233,69,96,0.3)',
              '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(233,69,96,0.4)' },
              transition: 'all 0.2s',
            }}
          >
            Add Lead
          </Button>
        }
      />

      {/* Filters */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 1, flex: 1 }}>
            <TextField
              placeholder="Search by name or email..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ flex: 1, minWidth: 220 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="outlined" size="small">Search</Button>
          </Box>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={handleStatusChange}>
              <MenuItem value="">All Statuses</MenuItem>
              {LEAD_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {(search || status) && (
            <Button
              size="small"
              onClick={() => { setSearch(''); setSearchInput(''); setStatus(''); setPage(1); }}
              color="inherit"
            >
              Clear
            </Button>
          )}
        </Stack>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(8)].map((_, j) => (
                        <TableCell key={j}><Skeleton /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : leads.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">No leads found</Typography>
                      </TableCell>
                    </TableRow>
                  )
                : leads.map((lead, i) => (
                    <TableRow
                      key={lead._id}
                      sx={{
                        animation: `fadeInUp 0.3s ease both`,
                        animationDelay: `${i * 0.04}s`,
                        '&:hover': { background: '#f5f6fa' },
                        transition: 'background 0.15s',
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{lead.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{lead.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{lead.phone || '—'}</Typography>
                      </TableCell>
                      <TableCell><StatusChip status={lead.status} /></TableCell>
                      <TableCell>
                        <Typography variant="body2">{lead.assignedTo?.name || '—'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{lead.company?.name || '—'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{formatDate(lead.createdAt)}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/leads/edit/${lead._id}`)}
                            sx={{ color: 'primary.main' }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => setDeleteId(lead._id)}
                            sx={{ color: 'error.main' }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <Pagination
              count={pagination.pages}
              page={page}
              onChange={(_, val) => setPage(val)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Lead"
        message="This lead will be soft-deleted and won't appear in future queries. Continue?"
        onConfirm={() => deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
      />
    </Box>
  );
};

export default LeadsListPage;
