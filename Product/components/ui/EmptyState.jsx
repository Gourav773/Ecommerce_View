import { FiInbox } from 'react-icons/fi';

export default function EmptyState({
  title = 'No data found',
  message = 'There are no items to display yet.',
  icon: Icon = FiInbox,
  action,
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      color: 'var(--text-muted)',
      textAlign: 'center',
    }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
      }}>
        <Icon size={36} style={{ color: 'var(--text-light)' }} />
      </div>
      <h3 style={{
        fontSize: '1.1rem',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        marginBottom: 6,
      }}>{title}</h3>
      <p style={{ fontSize: '0.875rem', maxWidth: 320 }}>{message}</p>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}
