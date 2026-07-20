import React from 'react';
import Checkbox from '../atoms/Checkbox';

function FilterGroup({ title, items = [], selectedItems = [], onItemChange }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px' }}>
        {title}
      </label>
      {/* items? diyerek undefined gelse bile çökmesini engelliyoruz */}
      {items?.map((item, index) => (
        <Checkbox 
          key={index}
          label={item}
          checked={selectedItems.includes(item)}
          onChange={() => onItemChange(item)}
        />
      ))}
    </div>
  );
}

export default FilterGroup;