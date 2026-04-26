import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, CircularProgress,
} from '@mui/material';
import { WarningAmber } from '@mui/icons-material';

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel, loading }) => (
  <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth
    PaperProps={{ sx: { borderRadius: 3 } }}>
    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
      <WarningAmber color="error" />
      {title || 'Confirm Action'}
    </DialogTitle>
    <DialogContent>
      <DialogContentText>{message || 'Are you sure you want to proceed?'}</DialogContentText>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onCancel} variant="outlined" disabled={loading}>Cancel</Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        color="error"
        disabled={loading}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {loading ? 'Deleting...' : 'Delete'}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
