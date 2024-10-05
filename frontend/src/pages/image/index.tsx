import React from 'react';

const ImagePage: React.FC = () => {
  const metadata = {
    LANDSAT_PRODUCT_ID: "LC08_L2SP_001001_20230515_02_T1",
    CLOUD_COVER: 10.5,
    DATE_PRODUCT_GENERATED: new Date("2023-05-20").toLocaleDateString(),
    SPACECRAFT_ID: "LANDSAT_8",
    SENSOR_ID: "OLI_TIRS",
    SUN_AZIMUTH: 135.7,
    SUN_ELEVATION: 65.3,
    WRS_PATH: 1,
    WRS_ROW: 1,
  };

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'white', backgroundColor: '#121212', minHeight: '100vh' }}>
      <div style={{ display: 'flex', paddingTop: '60px' }}>
        {/* Main content */}
        <div style={{ flex: 3, padding: '20px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Satellite Image</h1>
          <div style={{ 
            width: '100%', 
            height: '400px', 
            backgroundColor: '#2c2c2c', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            [Satellite Image Placeholder]
          </div>
          
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Graph</h2>
          <div style={{ 
            width: '100%', 
            height: '300px', 
            backgroundColor: '#2c2c2c', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}>
            [Graph Placeholder]
          </div>
        </div>
        
        {/* Sidebar */}
        <div style={{ 
          flex: 1, 
          backgroundColor: '#1e1e1e', 
          padding: '20px',
          borderLeft: '1px solid #333'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Metadata</h2>
          {Object.entries(metadata).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '10px' }}>
              <strong>{key.replace(/_/g, ' ')}:</strong>
              <br />
              {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImagePage;