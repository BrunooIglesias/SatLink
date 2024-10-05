import React from 'react';
import Graph from "@/components/images/Graph";
import SatelliteImage from "@/components/images/SatelliteImage";
import MetadataSidebar from "@/components/images/MetadataSidebar";

const ImageContainer: React.FC = () => {
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
                <div style={{ flex: 3, padding: '20px' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Satellite Image</h1>
                    <SatelliteImage />

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Graph</h2>
                    <Graph />
                </div>

                <MetadataSidebar metadata={metadata} />
            </div>
        </div>
    );
};

export default ImageContainer;
