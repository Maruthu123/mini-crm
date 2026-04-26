import React from 'react';
import { Chip } from '@mui/material';
import { STATUS_COLORS } from '../../utils/helpers';

const StatusChip = ({ status, size = 'small' }) => (
  <Chip
    label={status}
    size={size}
    color={STATUS_COLORS[status] || 'default'}
    sx={{ fontWeight: 600, fontSize: 12 }}
  />
);

export default StatusChip;
