import React from 'react';
import { TextField, Typography, Box } from '@mui/material';

interface UserDetailsFormProps {
    formData: { name: string; email: string };
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    latLng: { lat: number; lng: number } | null;
}

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({ formData, onInputChange, latLng }) => {
    return (
        <Box>
            <Typography variant="h6">Enter your details</Typography>
            {latLng && (
                <Typography variant="body2" gutterBottom>
                    <strong>Latitude:</strong> {latLng.lat.toFixed(6)} <br />
                    <strong>Longitude:</strong> {latLng.lng.toFixed(6)}
                </Typography>
            )}
            <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onInputChange}
                fullWidth
                margin="normal"
            />
        </Box>
    );
};

export default UserDetailsForm;
