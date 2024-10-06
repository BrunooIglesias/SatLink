import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const wavelengths = [
    { band: 'SR_B1', wavelength: 0.44, label: 'Coastal (B1)' },
    { band: 'SR_B2', wavelength: 0.48, label: 'Blue (B2)' },
    { band: 'SR_B3', wavelength: 0.56, label: 'Green (B3)' },
    { band: 'SR_B4', wavelength: 0.66, label: 'Red (B4)' },
    { band: 'SR_B5', wavelength: 0.86, label: 'NIR (B5)' },
    { band: 'SR_B6', wavelength: 1.6, label: 'SWIR1 (B6)' },
    { band: 'SR_B7', wavelength: 2.2, label: 'SWIR2 (B7)' },
    { band: 'ST_B10', wavelength: 11, label: 'Thermal IR (B10)' },
];

const prepareSpectralData = (spectralSignature: { [key: string]: number }) => {
    return wavelengths.map(({ band, wavelength, label }) => ({
        name: label,
        wavelength: wavelength,
        value: spectralSignature[band],
    }));
};

interface SpectralGraphProps {
    spectralSignature: { [key: string]: number };
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <Box sx={{ backgroundColor: '#333', color: '#fff', p: 2, borderRadius: '8px' }}>
                <Typography variant="body2" color="inherit">
                    <strong>{payload[0].payload.name}</strong>
                </Typography>
                <Typography variant="body2" color="inherit">
                    Wavelength: {payload[0].payload.wavelength} μm
                </Typography>
                <Typography variant="body2" color="inherit">
                    Reflectance: {payload[0].value}
                </Typography>
            </Box>
        );
    }

    return null;
};

const SpectralGraph: React.FC<SpectralGraphProps> = ({ spectralSignature }) => {
    const spectralData = prepareSpectralData(spectralSignature);

    return (
        <Box sx={{ padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '8px' }}>
            <Typography variant="h5" sx={{ color: 'white', marginBottom: '20px' }}>
                Spectral Signature (Reflectance vs. Wavelength)
            </Typography>
            <Paper sx={{ padding: 2, backgroundColor: '#1e1e1e', height: 500 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spectralData} margin={{ top: 30, right: 30, left: 50, bottom: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                        <XAxis
                            dataKey="wavelength"
                            type="number"
                            domain={[0.4, 11]}
                            label={{ value: 'Wavelength (μm)', position: 'insideBottom', fill: 'white', offset: 20 }}
                            tickFormatter={(value) => `${value} μm`}
                            stroke="white"
                        />
                        <YAxis
                            label={{ value: 'Reflectance', angle: -90, position: 'insideLeft', fill: 'white', offset: 20 }}
                            stroke="white"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#8884d8"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Paper>
        </Box>
    );
};

export default SpectralGraph;
