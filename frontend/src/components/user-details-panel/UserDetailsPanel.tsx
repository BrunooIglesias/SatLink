import React, { useState } from "react";
import { Button, Box, Paper, Stepper, Step, StepLabel, ThemeProvider, createTheme, CircularProgress } from "@mui/material";
import UserDetailsForm from "@/components/user-details-panel/components/UserDetailsForm";
import SatellitePropertiesForm from "@/components/user-details-panel/components/SatellitePropertiesForm";

interface UserDetailsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    formData: { name: string; email: string };
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    latLng: { lat: number; lng: number } | null;
    satelliteData: any;
    onSatelliteChange: (key: string, value: any) => void;
    isLoading: boolean;
}

const pureBlackTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ffffff',
        },
        secondary: {
            main: '#ffffff',
        },
        background: {
            default: '#000000',
            paper: '#000000',
        },
        text: {
            primary: '#ffffff',
            secondary: '#cccccc',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    color: '#000000',
                    backgroundColor: '#ffffff',
                    '&:hover': {
                        backgroundColor: '#e0e0e0',
                    },
                },
            },
        },
        MuiStepIcon: {
            styleOverrides: {
                root: {
                    color: '#333333',
                    '&.Mui-active': {
                        color: '#ffffff',
                    },
                    '&.Mui-completed': {
                        color: '#ffffff',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#000000',
                    backgroundImage: 'none',
                },
            },
        },
    },
});

const UserDetailsPanel: React.FC<UserDetailsPanelProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               formData,
                                                               onInputChange,
                                                               onSubmit,
                                                               latLng,
                                                               satelliteData,
                                                               onSatelliteChange,
                                                               isLoading
                                                           }) => {
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const steps = ["Personal Details", "Satellite Properties"];

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <UserDetailsForm
                        formData={formData}
                        onInputChange={onInputChange}
                        latLng={latLng}
                    />
                );
            case 1:
                return (
                    <SatellitePropertiesForm
                        satellite={satelliteData.satellite}
                        cloudThreshold={satelliteData.cloudThreshold}
                        mostRecentImage={satelliteData.mostRecentImage}
                        metadata={satelliteData.metadata}
                        dataValues={satelliteData.dataValues}
                        spectralSignature={satelliteData.spectralSignature}
                        fromDate={satelliteData.fromDate}
                        toDate={satelliteData.toDate}
                        onSatelliteChange={(key, value) => onSatelliteChange(key, value)}
                    />
                );
            default:
                return "Unknown step";
        }
    };

    return (
        <ThemeProvider theme={pureBlackTheme}>
            <Paper
                elevation={3}
                sx={{
                    position: "absolute",
                    top: 0,
                    left: isOpen ? 0 : "-100%",
                    height: "calc(100% - 64px)",
                    width: "300px",
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    transition: "left 0.3s ease-in-out",
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    padding: "1rem",
                    marginTop: "64px",
                    borderRight: "1px solid #333333",
                }}
            >
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box sx={{ flexGrow: 1, mt: 2 }}>{renderStepContent(activeStep)}</Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: activeStep > 0 ? "space-between" : "center",
                        mt: 2,
                    }}
                >
                    {activeStep > 0 && (
                        <Button
                            variant="contained"
                            onClick={handleBack}
                            sx={{ width: "48%" }}
                        >
                            Back
                        </Button>
                    )}
                    {activeStep < steps.length - 1 ? (
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ width: activeStep > 0 ? "48%" : "100%" }}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={onSubmit}
                            sx={{ width: "48%" }}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} /> : "Submit"}
                        </Button>
                    )}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Button
                        variant="contained"
                        onClick={onClose}
                        fullWidth
                        sx={{
                            color: '#000000',
                            backgroundColor: '#ffffff',
                            '&:hover': {
                                backgroundColor: '#e0e0e0',
                            },
                        }}
                    >
                        Close
                    </Button>
                </Box>
            </Paper>
        </ThemeProvider>
    );
};

export default UserDetailsPanel;
