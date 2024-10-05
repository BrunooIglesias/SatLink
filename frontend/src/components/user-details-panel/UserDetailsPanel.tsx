import React, { useState } from "react";
import {
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Stepper,
    Step,
    StepLabel,
    MenuItem,
    Checkbox,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    FormGroup
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
    const [activeStep, setActiveStep] = useState(0);
    const [satellite, setSatellite] = useState('');
    const [cloudThreshold, setCloudThreshold] = useState('');
    const [mostRecentImage, setMostRecentImage] = useState(true);
    const [metadata, setMetadata] = useState(false);
    const [dataValues, setDataValues] = useState(false);
    const [spectralSignature, setSpectralSignature] = useState(false);
    const [dateRange, setDateRange] = useState('');

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSatelliteChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSatellite(event.target.value as string);
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.name) {
            case 'metadata':
                setMetadata(event.target.checked);
                break;
            case 'dataValues':
                setDataValues(event.target.checked);
                break;
            case 'spectralSignature':
                setSpectralSignature(event.target.checked);
                break;
        }
    };

    const steps = ['Personal Details', 'Satellite Properties'];

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
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
            case 1:
                return (
                    <Box>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Select Satellite</InputLabel>
                            <Select
                                value={satellite}
                                onChange={handleSatelliteChange}
                                label="Satellite"
                            >
                                <MenuItem value="landsat9">Landsat 9</MenuItem>
                                <MenuItem value="landsat8">Landsat 8</MenuItem>
                                <MenuItem value="hsla">HSLA</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Cloud Threshold"
                            type="number"
                            value={cloudThreshold}
                            onChange={(e) => setCloudThreshold(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={mostRecentImage}
                                    onChange={(e) => setMostRecentImage(e.target.checked)}
                                    name="mostRecentImage"
                                />
                            }
                            label="Most Recent Image"
                        />
                        {!mostRecentImage && (
                            <TextField
                                label="Date Range"
                                type="date"
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                        )}
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={metadata}
                                        onChange={handleCheckboxChange}
                                        name="metadata"
                                    />
                                }
                                label="Metadata"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={dataValues}
                                        onChange={handleCheckboxChange}
                                        name="dataValues"
                                    />
                                }
                                label="Data Values"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={spectralSignature}
                                        onChange={handleCheckboxChange}
                                        name="spectralSignature"
                                    />
                                }
                                label="Spectral Signature"
                            />
                        </FormGroup>
                    </Box>
                );
            default:
                return 'Unknown step';
        }
    };

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
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box sx={{ flexGrow: 1, mt: 2 }}>
                {renderStepContent(activeStep)}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: activeStep > 0 ? 'space-between' : 'center', mt: 2 }}>
                {activeStep > 0 && (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleBack}
                        sx={{ width: '48%' }}
                    >
                        Back
                    </Button>
                )}
                {activeStep < steps.length - 1 ? (
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ width: activeStep > 0 ? '48%' : '100%' }}
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={onSubmit}
                        sx={{ width: '48%' }}
                    >
                        Submit
                    </Button>
                )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button variant="text" color="secondary" onClick={onClose} fullWidth>
                    Close
                </Button>
            </Box>
        </Paper>
    );
};

export default UserDetailsPanel;
