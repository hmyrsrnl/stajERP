import React from 'react';
import Button from '../atoms/Button';

function ExaminationTable({ examinations, onEditClick, isReadOnly = false }) {
  if (examinations.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '30px', color: '#777', fontStyle: 'italic' }}>
        Bu personele ait geçmiş bir muayene kaydı bulunamadı.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#b2dfdb', color: '#004d40', borderBottom: '2px solid #00796b' }}>
            <th style={{ padding: '12px 10px' }}>Tarih</th>
            <th style={{ padding: '12px 10px' }}>Muayene Tipi</th>
            <th style={{ padding: '12px 10px' }}>Sonuç / Tanı</th>
            <th style={{ padding: '12px 10px' }}>Açıklama / Reçete</th>
            <th style={{ padding: '12px 10px' }}>Hekim</th>
            {!isReadOnly && <th style={{ padding: '12px 10px', textAlign: 'center' }}>İşlem</th>}
          </tr>
        </thead>
        <tbody>
          {examinations.map((exam) => (
            <tr key={exam.id} style={{ borderBottom: '1px solid #dee2e6', background: '#fff' }}>
              <td style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>{exam.exam_date}</td>
              <td style={{ padding: '12px 10px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  background: exam.exam_type === 'Periyodik' ? '#e0f7fa' : '#fff3e0',
                  color: exam.exam_type === 'Periyodik' ? '#006064' : '#e65100',
                  border: exam.exam_type === 'Periyodik' ? '1px solid #00acc1' : '1px solid #ffb74d'
                }}>
                  {exam.exam_type}
                </span>
              </td>
              <td style={{ padding: '12px 10px', fontWeight: '500' }}>{exam.result}</td>
              <td style={{ padding: '12px 10px', color: '#555', fontSize: '14px' }}>{exam.description || '-'}</td>
              <td style={{ padding: '12px 10px', fontStyle: 'italic' }}>{exam.doctor_name || 'Bilinmeyen Hekim'}</td>
              
              {!isReadOnly && (
                <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                  <Button 
                    onClick={() => onEditClick && onEditClick(exam.id)} 
                    style={{ padding: '5px 10px', fontSize: '12px', background: '#12a48c' }}
                  >
                    Düzenle
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExaminationTable;