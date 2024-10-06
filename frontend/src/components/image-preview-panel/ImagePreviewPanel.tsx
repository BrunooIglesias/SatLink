import React from "react";
import { Box, Button, Paper, ThemeProvider, createTheme } from "@mui/material";

interface ImagePreviewPanelProps {
    isOpen: boolean;
    onClose: () => void;
    previewImages: string[];
}

const pureBlackTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ffffff',
        },
        background: {
            default: '#000000',
            paper: '#000000',
        },
        text: {
            primary: '#ffffff',
        },
    },
});

const ImagePreviewPanel: React.FC<ImagePreviewPanelProps> = ({ isOpen, onClose, previewImages }) => {
    return (
        <ThemeProvider theme={pureBlackTheme}>
            <Paper
                elevation={3}
                sx={{
                    position: "absolute",
                    top: 0,
                    right: isOpen ? 0 : "-100%",
                    height: "calc(100% - 64px)",
                    width: "300px",
                    backgroundColor: "#000000",  
                    color: "#ffffff",
                    transition: "right 0.3s ease-in-out",
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    padding: "1rem",
                    marginTop: "64px",
                    borderLeft: "1px solid #333333",
                }}
            >
                <h2 style={{ marginBottom: "20px" }}>Preview Images</h2>

                {/* Scrollable container for images */}
                <Box
                    sx={{
                        flexGrow: 1,
                        overflowY: "auto",  
                        maxHeight: "calc(100% - 120px)",
                    }}
                >
                    {previewImages.length > 0 ? (
                        previewImages.map((imgUrl, index) => (
                            <img
                                key={index}
                                src={imgUrl}
                                alt={`Preview ${index + 1}`}
                                style={{ width: "100%", marginBottom: "10px" }}
                            />
                        ))
                    ) : (
                        <p>No images available</p>
                    )}
                </Box>

                {/* Position the Close button at the bottom and make it full-width */}
                <Box
                    sx={{
                        mt: "auto", 
                    }}
                >
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

export default ImagePreviewPanel;
