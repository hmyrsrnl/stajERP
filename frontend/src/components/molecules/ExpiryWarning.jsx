import React from 'react';

function ExpiryWarning({ expiryDate }) {
    if (!expiryDate) return null;

    const today = new Date();
    const expiry = new Date(expiryDate);

    const timeDiff = expiry.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    let iconColor = '';
    let tooltipContent = null;
    let shouldWarn = false;

    if (daysLeft < 0) {
        shouldWarn = true;
        iconColor = '#d32f2f';
        tooltipContent = (
            <span>
                Dikkat! Bu belgenin geçerlilik süresi <strong style={{ color: '#ff8a80', fontWeight: 'bold' }}>{Math.abs(daysLeft)} gün önce</strong> dolmuş!
            </span>
        );
    } else if (daysLeft <= 15) {
        shouldWarn = true;
        iconColor = '#f57c00';
        tooltipContent = (
            <span>
                Dikkat! Belgenin geçerlilik tarihine sadece <strong style={{ color: '#ffd54f', fontWeight: 'bold' }}>{daysLeft} gün</strong> kaldı.
            </span>
        );
    }

    if (!shouldWarn) return null;

    return (
        <div
            className="expiry-tooltip-container"
            style={{
                position: 'relative',
                display: 'inline-block',
                cursor: 'help',
                marginLeft: '8px',
                verticalAlign: 'middle'
            }}
        >
            <span style={{
                color: iconColor,
                fontWeight: 'bold',
                fontSize: '14px',
                background: `${iconColor}15`,
                padding: '2px 7px',
                borderRadius: '50%',
                border: `1px solid ${iconColor}`,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '18px',
                height: '18px'
            }}>
                !
            </span>

            <div className="expiry-tooltip-text" style={{
                visibility: 'hidden',
                whiteSpace: 'nowrap', 
                width: 'auto',       
                minWidth: '250px',    
                backgroundColor: '#212121',
                color: '#ffffff',
                textAlign: 'center',
                borderRadius: '6px',
                padding: '10px 14px', 
                position: 'absolute',
                zIndex: 9999,
                bottom: '140%',
                left: '50%',
                marginLeft: '-135px', 
                opacity: 0,
                transition: 'opacity 0.2s ease-in-out',
                fontSize: '13px',
                lineHeight: '1.5',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                pointerEvents: 'none'
            }}>
                {tooltipContent}

                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    marginLeft: '-5px',
                    borderWidth: '5px',
                    borderStyle: 'solid',
                    borderColor: '#212121 transparent transparent transparent'
                }} />
            </div>

            <style>{`
        .expiry-tooltip-container:hover .expiry-tooltip-text {
          visibility: visible !important;
          opacity: 1 !important;
        }
      `}</style>
        </div>
    );
}

export default ExpiryWarning;