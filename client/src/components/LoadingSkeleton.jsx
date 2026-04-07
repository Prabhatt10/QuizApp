const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="skeleton-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-text"></div>
            <div className="skeleton-line skeleton-text short"></div>
            <div className="skeleton-line skeleton-btn"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="skeleton-table">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-row">
            <div className="skeleton-line skeleton-cell"></div>
            <div className="skeleton-line skeleton-cell wide"></div>
            <div className="skeleton-line skeleton-cell"></div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
