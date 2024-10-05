import React from 'react';

interface SatelliteImageProps {
    src: string;
}

const SatelliteImage: React.FC<SatelliteImageProps> = ({ src }) => {
    return (
        <div style={{
            width: '100%',
            height: '400px',
            backgroundColor: '#2c2c2c',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px'
        }}>
            <img src={src} alt="Satellite" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </div>
    );
};

export default SatelliteImage;
