import React from 'react';

interface GraphProps {
    data: any;
}

const Graph: React.FC<GraphProps> = ({ data }) => {
    return (
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
    );
};

export default Graph;
