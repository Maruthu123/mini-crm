import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box, Card, CardContent, Grid, Typography, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Button, Skeleton, Divider,
} from '@mui/material';
import { ArrowBack, Business, LocationOn, Language, People } from '@mui/icons-material';
import api from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import { formatDate } from '../../utils/helpers';

const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
    <Box sx={{ color: 'text.secondary', display: 'flex' }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={500}>{value || '—'}</Typography>
    </Box>
  </Box>
);

const CompanyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      const { data } = await api.get(`/companies/${id}`);
      return data;
    },
  });

  const company = data?.data;
  const leads = data?.leads || [];

  if (isLoading) {
    return (
      <Box>
        <Skeleton height={40} width={200} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}><Skeleton variant="rounded" height={200} /></Grid>
          <Grid item xs={12} md={8}><Skeleton variant="rounded" height={300} /></Grid>
        </Grid>
      </Box>
    );
  }

  if (!company) return null;

  return (
    <Box className="page-enter">
      <PageHeader
        title={company.name}
        breadcrumbs={[
          { label: 'Companies', path: '/companies' },
          { label: company.name },
        ]}
        action={
          <Button startIcon={<ArrowBack />} variant="outlined" onClick={() => navigate('/companies')}>
            Back
          </Button>
        }
      />

      <Grid container spacing={3}>
        {/* Company Info */}
        <Grid item xs={12} md={4}>
          <Card className="card-enter" sx={{ animationDelay: '0.05s' }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  width: 64, height: 64, borderRadius: '16px',
                  background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mb: 2, color: '#fff',
                }}
              >
                <Business sx={{ fontSize: 28 }} />
              </Box>
              <Typography variant="h6" fontWeight={700}>{company.name}</Typography>
              {company.industry && (
                <Chip label={company.industry} size="small" sx={{ mt: 1, mb: 2 }} />
              )}
              <Divider sx={{ my: 2 }} />
              <InfoRow icon={<LocationOn fontSize="small" />} label="Location" value={company.location} />
              <InfoRow icon={<Language fontSize="small" />} label="Website"
                value={company.website
                  ? <a href={company.website} target="_blank" rel="noreferrer" style={{ color: '#e94560' }}>{company.website}</a>
                  : null}
              />
              <InfoRow icon={<People fontSize="small" />} label="Created By" value={company.createdBy?.name} />
              <InfoRow icon={<Business fontSize="small" />} label="Added On" value={formatDate(company.createdAt)} />
            </CardContent>
          </Card>
        </Grid>

        {/* Associated Leads */}
        <Grid item xs={12} md={8}>
          <Card className="card-enter" sx={{ animationDelay: '0.1s' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Associated Leads ({leads.length})
              </Typography>
              {leads.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">No leads associated with this company</Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Assigned To</TableCell>
                        <TableCell>Created</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leads.map((lead) => (
                        <TableRow key={lead._id} hover sx={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/leads/edit/${lead._id}`)}>
                          <TableCell><Typography variant="body2" fontWeight={600}>{lead.name}</Typography></TableCell>
                          <TableCell><Typography variant="body2" color="text.secondary">{lead.email}</Typography></TableCell>
                          <TableCell><StatusChip status={lead.status} /></TableCell>
                          <TableCell>{lead.assignedTo?.name || '—'}</TableCell>
                          <TableCell>{formatDate(lead.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyDetailPage;
