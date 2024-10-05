import React, { useState } from "react";
import {
    Button,
    Box,
    Paper,
    Stepper,
    Step,
    StepLabel
} from "@mui/material";
import UserDetailsForm from "@/components/user-details-panel/components/UserDetailsForm";
import SatellitePropertiesForm from "@/components/user-details-panel/components/SatellitePropertiesForm";

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

    const steps = ['Personal Details', 'Satellite Properties'];

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
                        satellite={satellite}
                        cloudThreshold={cloudThreshold}
                        mostRecentImage={mostRecentImage}
                        metadata={metadata}
                        dataValues={dataValues}
                        spectralSignature={spectralSignature}
                        dateRange={dateRange}
                        onSatelliteChange={(e) => setSatellite(e.target.value as string)}
                        onMostRecentChange={(e) => setMostRecentImage(e.target.checked)}
                        onCheckboxChange={(e) => {
                            switch (e.target.name) {
                                case 'metadata':
                                    setMetadata(e.target.checked);
                                    break;
                                case 'dataValues':
                                    setDataValues(e.target.checked);
                                    break;
                                case 'spectralSignature':
                                    setSpectralSignature(e.target.checked);
                                    break;
                            }
                        }}
                        onCloudThresholdChange={(e) => setCloudThreshold(e.target.value)}
                        onDateRangeChange={(e) => setDateRange(e.target.value)}
                    />
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
