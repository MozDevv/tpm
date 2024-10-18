import { Empty } from 'antd';
import React from 'react';

function BaseEmptyComponent({ title, scale = 0.7 }) {
  // Dynamic styles based on the scale prop
  const scaledStyle = {
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
  };

  return (
    <div>
      <div className="mt-20" style={scaledStyle}>
        <Empty description={title ? title : ''} />
      </div>
    </div>
  );
}

export default BaseEmptyComponent;
