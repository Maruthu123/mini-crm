import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Typography, Skeleton, IconButton, Tooltip,
} from '@mui/material';
import { Add, Visibility, Business } from '@mui/icons-material';
import api from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import { formatDate } from '../../utils/helpers';

const CompaniesListPage = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data } = await api.get('/companies');
      return data.data;
    },
  });

  const companies = data || [];

  return (
    <Box className="page-enter">
      <PageHeader
        title="Companies"
        subtitle={`${companies.length} companies`}
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/companies/new')}
            sx={{
              background: 'linear-gradient(135deg, #e94560, #c73652)',
              boxShadow: '0 4px 15px rgba(233,69,96,0.3)',
              '&:hover': { transform: 'translateY(-1px)' },
              transition: 'all 0.2s',
            }}
          >
            Add Company
          </Button>
        }
      />

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>Industry</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Website</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? [...Array(4)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(7)].map((_, j) => (
                        <TableCell key={j}><Skeleton /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : companies.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Business sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                        <Typography color="text.secondary">No companies yet</Typography>
                      </TableCell>
                    </TableRow>
                  )
                : companies.map((company, i) => (
                    <TableRow
                      key={company._id}
                      sx={{
                        animation: `fadeInUp 0.3s ease both`,
                        animationDelay: `${i * 0.04}s`,
                        '&:hover': { background: '#f5f6fa', cursor: 'pointer' },
                        transition: 'background 0.15s',
                      }}
                      onClick={() => navigate(`/companies/${company._id}`)}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{company.name}</Typography>
                      </TableCell>
                      <TableCell>{company.industry || '—'}</TableCell>
                      <TableCell>{company.location || '—'}</TableCell>
                      <TableCell>
                        {company.website
                          ? <a href={company.website} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: '#e94560' }}>{company.website}</a>
                          : '—'
                        }
                      </TableCell>
                      <TableCell>{company.createdBy?.name || '—'}</TableCell>
                      <TableCell>{formatDate(company.createdAt)}</TableCell>
                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/companies/${company._id}`)}
                            sx={{ color: 'primary.main' }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default CompaniesListPage;
