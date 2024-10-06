import React from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';
import SatelliteImage from "@/components/images/SatelliteImage";
import SpectralGraph from "@/components/images/SpectralGraph";

interface ImageContainerProps {
    imageData: {
        image: string;
        dataValues: { [key: string]: number };
        SpectralSignature: { [key: string]: number };
    };
}

const ImageContainer: React.FC<ImageContainerProps> = ({ imageData }) => {
    const { image, dataValues, SpectralSignature } = imageData;

    const transformedDataValues = Object.entries(dataValues).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {} as { [key: string]: number });

    return (
        <Box sx={{ fontFamily: "'Space Grotesk', sans-serif", color: 'white', backgroundColor: '#121212', minHeight: '100vh', p: 3 }}>
            <Typography variant="h4" sx={{ marginBottom: '20px' }}>Satellite Image</Typography>
            <SatelliteImage src={image} />

            <Typography variant="h5" sx={{ marginTop: '40px', marginBottom: '20px' }}>Band 10 Surface Temperature</Typography>
            <Paper sx={{ padding: 2, backgroundColor: '#1e1e1e' }}>
                <Grid container spacing={2}>
                    {Object.entries(transformedDataValues).map(([key, value]) => (
                        <Grid item xs={12} sm={6} key={key}>
                            <Typography variant="body1" sx={{ color: 'white' }}>
                                <strong>{key.replace(/_/g, ' ')}:</strong> {value.toFixed(2)} K
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            <Typography variant="h5" sx={{ marginTop: '40px', marginBottom: '20px' }}>Spectral Signature</Typography>
            <SpectralGraph spectralSignature={SpectralSignature} />
        </Box>
    );
};

export default ImageContainer;