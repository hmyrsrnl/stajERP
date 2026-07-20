import React from 'react';
import FilterGroup from '../molecules/FilterGroup';
import Button from '../atoms/Button'; 

function FilterPanel({
    searchTerm,
    onSearchChange,
    departments = [],
    selectedGenders = [],
    onGenderChange,
    selectedDepts = [],   
    onDeptChange,        
    selectedStatus = [],
    onStatusChange,
    showDepartments = true,
    showGenders = true, 
    themeColor = '#f7a33c',
    onExport
}) {
    return (
        <div style={{
            width: '240px',
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #dee2e6',
            textAlign: 'left',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            height: 'fit-content'
        }}>
            <h3 style={{
                marginTop: 0,
                marginBottom: '15px',
                color: '#333',
                fontSize: '16px',
                borderBottom: `2px solid ${themeColor}`,
                paddingBottom: '5px'
            }}>
                Filtreleme
            </h3>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Personel Ara</label>
                <input
                    type="text"
                    placeholder="İsim veya Soyisim ile ara..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={{
                        padding: '8px 15px',
                        borderRadius: '20px',
                        border: '1px solid #ccc',
                        outline: 'none',
                        fontSize: '14px',
                        width: '85%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    }}
                />
            </div>

            {showGenders && (
                <FilterGroup
                    title="Cinsiyet"
                    items={['Kadın', 'Erkek']}
                    selectedItems={selectedGenders}
                    onItemChange={onGenderChange}
                />
            )}

            {showDepartments && (
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px' }}>
                        Departmanlar
                    </label>
                    <FilterGroup
                        items={departments}
                        selectedItems={selectedDepts} 
                        onItemChange={onDeptChange}    
                    />
                </div>
            )}

            <div style={{ marginBottom: '25px' }}>
                <FilterGroup
                    title="Çalışan Durumu"
                    items={['Aktif', 'Pasif']}
                    selectedItems={selectedStatus}
                    onItemChange={onStatusChange}
                />
            </div>

            {onExport && (
                <Button 
                    onClick={onExport}
                    style={{
                        width: '100%',
                        padding: '10px',
                        background: '#1f804e', 
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    Excel Olarak İndir
                </Button>
            )}
        </div>
    );
}

export default FilterPanel;