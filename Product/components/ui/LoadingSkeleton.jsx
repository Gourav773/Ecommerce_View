import styles from './LoadingSkeleton.module.css';

export default function LoadingSkeleton({ width, height, count = 1, circle, style: customStyle }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={styles.skeleton}
          style={{
            width: circle ? (height || '40px') : (width || '100%'),
            height: height || '20px',
            borderRadius: circle ? '50%' : 'var(--radius-sm)',
            ...customStyle,
          }}
        />
      ))}
    </>
  );
}
