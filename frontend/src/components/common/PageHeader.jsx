import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const PageHeader = ({ title, subtitle, breadcrumbs = [], action }) => (
  <Box
    sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}
    className="page-enter"
  >
    <Box>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 0.5, '& .MuiBreadcrumbs-separator': { color: 'text.disabled' } }}
        >
          {breadcrumbs.map((crumb, i) =>
            crumb.path ? (
              <Link
                key={i}
                component={RouterLink}
                to={crumb.path}
                underline="hover"
                color="text.secondary"
                variant="caption"
                fontWeight={500}
              >
                {crumb.label}
              </Link>
            ) : (
              <Typography key={i} variant="caption" color="text.primary" fontWeight={600}>
                {crumb.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}
      <Typography variant="h5" fontWeight={700} color="text.primary">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" mt={0.3}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {action && <Box>{action}</Box>}
  </Box>
);

export default PageHeader;
