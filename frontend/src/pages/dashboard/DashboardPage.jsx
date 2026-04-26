import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import {
  People, CheckCircle, Assignment, TrendingUp,
} from '@mui/icons-material';
import api from '../../services/api';
import PageHeader from '../../components/common/PageHeader';

const StatCard = ({ title, value, icon, color, delay = 0, subtitle }) => (
  <Card
    className="card-enter"
    sx={{
      height: '100%',
      animationDelay: `${delay}s`,
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500} mb={0.5}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            {value ?? <Skeleton width={60} />}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '14px',
            background: `${color}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </Box>
      {/* Decorative bottom bar */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
        }}
      />
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats');
      return data.data;
    },
  });

  const stats = [
    {
      title: 'Total Leads',
      value: data?.totalLeads,
      icon: <People sx={{ fontSize: 26 }} />,
      color: '#1a1a2e',
      subtitle: 'All active leads',
      delay: 0.05,
    },
    {
      title: 'Qualified Leads',
      value: data?.qualifiedLeads,
      icon: <TrendingUp sx={{ fontSize: 26 }} />,
      color: '#00b894',
      subtitle: 'Ready to close',
      delay: 0.1,
    },
    {
      title: 'Tasks Due Today',
      value: data?.tasksDueToday,
      icon: <Assignment sx={{ fontSize: 26 }} />,
      color: '#e94560',
      subtitle: 'Need attention',
      delay: 0.15,
    },
    {
      title: 'Completed Tasks',
      value: data?.completedTasks,
      icon: <CheckCircle sx={{ fontSize: 26 }} />,
      color: '#0984e3',
      subtitle: 'All time',
      delay: 0.2,
    },
  ];

  return (
    <Box className="page-enter">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's your CRM overview."
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.title}>
            {isLoading ? (
              <Skeleton variant="rounded" height={130} sx={{ borderRadius: 3 }} />
            ) : (
              <StatCard {...stat} />
            )}
          </Grid>
        ))}
      </Grid>

      {/* Lead Status Breakdown */}
      {data?.leadsByStatus && data.leadsByStatus.length > 0 && (
        <Card className="card-enter" sx={{ animationDelay: '0.25s' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={3}>
              Leads by Status
            </Typography>
            <Grid container spacing={2}>
              {data.leadsByStatus.map((item) => {
                const colors = {
                  New: '#0984e3',
                  Contacted: '#fdcb6e',
                  Qualified: '#00b894',
                  Lost: '#e17055',
                  Won: '#6c5ce7',
                };
                const color = colors[item._id] || '#999';
                const total = data.totalLeads || 1;
                const pct = Math.round((item.count / total) * 100);

                return (
                  <Grid item xs={12} sm={6} md={4} key={item._id}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: `${color}0d`,
                        border: `1px solid ${color}22`,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight={600} color={color}>
                          {item._id}
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                          {item.count}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          background: `${color}30`,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${pct}%`,
                            background: color,
                            borderRadius: 3,
                            transition: 'width 0.8s ease',
                          }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                        {pct}% of total
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default DashboardPage;
