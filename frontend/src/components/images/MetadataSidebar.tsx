import React from 'react';

interface MetadataSidebarProps {
    metadata: { [key: string]: string | number };
}

const MetadataSidebar: React.FC<MetadataSidebarProps> = ({ metadata }) => {
    return (
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
    );
};

export default MetadataSidebar;
