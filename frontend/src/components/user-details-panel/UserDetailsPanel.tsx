import React from "react";
import {
    TextField,
    Button,
    Typography,
    Box,
    Paper
} from "@mui/material";

interface UserDetailsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    formData: { name: string; email: string };
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    latLng: { lat: number; lng: number } | null;
}

const UserDetailsPanel: React.FC<UserDetailsPanelProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               formData,
                                                               onInputChange,
                                                               onSubmit,
                                                               latLng,
                                                           }) => {
    return (
        <Paper
            elevation={3}
            sx={{
                position: "absolute",
                top: 0,
                left: isOpen ? 0 : "-100%",
                height: "calc(100% - 64px)",
                width: "300px",
                backgroundColor: "#fff",
                transition: "left 0.3s ease-in-out",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                padding: "1rem",
                marginTop: "64px",
            }}
        >
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">Enter your details</Typography>
                {latLng && (
                    <Typography variant="body2" gutterBottom>
                        Latitude: {latLng.lat}, Longitude: {latLng.lng}
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
            <Box>
                <Button variant="contained" onClick={onSubmit} fullWidth>
                    Submit
                </Button>
                <Button
                    variant="text"
                    color="secondary"
                    onClick={onClose}
                    fullWidth
                >
                    Close
                </Button>
            </Box>
        </Paper>
    );
};

export default UserDetailsPanel;
