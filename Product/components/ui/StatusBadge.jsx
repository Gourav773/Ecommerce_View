export default function StatusBadge({ status }) {
  const getColors = () => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'approved':
        return { bg: 'var(--success-light)', color: '#065f46' };
      case 'pending':
        return { bg: 'var(--warning-light)', color: '#92400e' };
      case 'deactive':
      case 'rejected':
      case 'inactive':
        return { bg: 'var(--danger-light)', color: '#991b1b' };
      default:
        return { bg: 'var(--border-light)', color: 'var(--text-muted)' };
    }
  };

  const colors = getColors();

  return (
    <span style={{
      background: colors.bg,
      color: colors.color,
      padding: '4px 14px',
      borderRadius: '20px',
      fontSize: '0.78rem',
      fontWeight: 600,
      display: 'inline-block',
      textTransform: 'capitalize',
      whiteSpace: 'nowrap',
    }}>
      {status || 'N/A'}
    </span>
  );
}
