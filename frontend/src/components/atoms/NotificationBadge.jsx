import React from 'react';

function NotificationBadge({ count }) {
  if (!count || count === 0) return null;

  return (
    <span style={{
      backgroundColor: '#e53e3e',
      color: 'white',
      borderRadius: '12px',
      padding: '2px 8px',
      fontSize: '12px',
      fontWeight: 'bold',
      marginLeft: '8px',
      display: 'inline-block'
    }}>
      {count}
    </span>
  );
}

export default NotificationBadge;