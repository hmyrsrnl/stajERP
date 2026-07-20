import React from 'react';
import Button from '../atoms/Button'; 

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null; 

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      gap: '8px', 
      marginTop: '20px', 
      paddingTop: '10px' 
    }}>
      
      <Button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        style={{
          padding: '6px 12px',
          borderRadius: '20px',
          background: currentPage === 1 ? '#e0e0e0' : '#ffffff',
          color: '#333',
          border: '1px solid #ccc',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
        }}
      >
        «
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
        <Button
          key={number}
          onClick={() => onPageChange(number)}
          style={{
            padding: '6px 12px',
            borderRadius: '50%', 
            width: '35px',
            height: '35px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: currentPage === number ? '#00796b' : '#ffffff',
            color: currentPage === number ? 'white' : '#333',
            border: '1px solid #ccc',
            fontWeight: currentPage === number ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          {number}
        </Button>
      ))}

      <Button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        style={{
          padding: '6px 12px',
          borderRadius: '20px',
          background: currentPage === totalPages ? '#e0e0e0' : '#ffffff',
          color: '#333',
          border: '1px solid #ccc',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
        }}
      >
        »
      </Button>
    </div>
  );
}

export default Pagination;