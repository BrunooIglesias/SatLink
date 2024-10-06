import React from "react";
import Button from '@mui/material/Button';

interface ButtonProps {
    label: string;
    onClick: () => void;
}

const CustomButton = ({ label, onClick }: ButtonProps) => {
    return (
        <Button
            variant="contained"
            className="bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 px-4 py-2 rounded-md"
            onClick={onClick}
        >
            {label}
        </Button>
    );
};

export default CustomButton;
