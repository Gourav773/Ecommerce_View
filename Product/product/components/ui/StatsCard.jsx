import styles from './StatsCard.module.css';

export default function StatsCard({ title, value, icon: Icon, trend, trendUp, color = 'primary' }) {
  return (
    <div className={`${styles.card} ${styles[color] || ''}`}>
      <div className={styles.iconWrap}>
        {Icon && <Icon size={22} />}
      </div>
      <div className={styles.info}>
        <span className={styles.label}>{title}</span>
        <span className={styles.value}>{value ?? '—'}</span>
        {trend && (
          <span className={`${styles.trend} ${trendUp ? styles.up : styles.down}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
    </div>
  );
}
