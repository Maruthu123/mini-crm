export const STATUS_COLORS = {
  New: 'info',
  Contacted: 'warning',
  Qualified: 'success',
  Lost: 'error',
  Won: 'success',
  Pending: 'warning',
  'In Progress': 'info',
  Completed: 'success',
};

export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost', 'Won'];
export const TASK_STATUSES = ['Pending', 'In Progress', 'Completed'];

export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
