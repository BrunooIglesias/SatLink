import React from 'react';
import Graph from "@/components/images/Graph";
import SatelliteImage from "@/components/images/SatelliteImage";
import MetadataSidebar from "@/components/images/MetadataSidebar";

interface ImageContainerProps {
    imageData: {
        name: string;
        email: string;
        image: string;
        metadata: { [key: string]: string | number };
        dataValues: any;
        spectralSignature: any;
    };
}

const ImageContainer: React.FC<ImageContainerProps> = ({ imageData }) => {
    const { image, metadata, dataValues, spectralSignature } = imageData;

    return (
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'white', backgroundColor: '#121212', minHeight: '100vh' }}>
            <div style={{ display: 'flex', paddingTop: '60px' }}>
                <div style={{ flex: 3, padding: '20px' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Satellite Image</h1>
                    <SatelliteImage src={image} />

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Graph</h2>
                    <Graph data={dataValues} />

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Spectral Signature</h2>
                </div>

                <MetadataSidebar metadata={metadata} />
            </div>
        </div>
    );
};

export default ImageContainer;
