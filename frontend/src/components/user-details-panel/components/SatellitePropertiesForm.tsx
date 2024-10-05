import React from 'react';
import {
    TextField,
    MenuItem,
    FormControlLabel,
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    FormGroup,
    Box
} from '@mui/material';

interface SatellitePropertiesFormProps {
    satellite: string;
    cloudThreshold: string;
    mostRecentImage: boolean;
    metadata: boolean;
    dataValues: boolean;
    spectralSignature: boolean;
    dateRange: string;
    onSatelliteChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
    onMostRecentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCloudThresholdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDateRangeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SatellitePropertiesForm: React.FC<SatellitePropertiesFormProps> = ({
                                                                             satellite,
                                                                             cloudThreshold,
                                                                             mostRecentImage,
                                                                             metadata,
                                                                             dataValues,
                                                                             spectralSignature,
                                                                             dateRange,
                                                                             onSatelliteChange,
                                                                             onMostRecentChange,
                                                                             onCheckboxChange,
                                                                             onCloudThresholdChange,
                                                                             onDateRangeChange
                                                                         }) => {
    return (
        <Box>
            <FormControl fullWidth margin="normal">
                <InputLabel>Select Satellite</InputLabel>
                <Select
                    value={satellite}
                    onChange={onSatelliteChange}
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
                onChange={onCloudThresholdChange}
                fullWidth
                margin="normal"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={mostRecentImage}
                        onChange={onMostRecentChange}
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
                    onChange={onDateRangeChange}
                    fullWidth
                    margin="normal"
                />
            )}
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={metadata}
                            onChange={onCheckboxChange}
                            name="metadata"
                        />
                    }
                    label="Metadata"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={dataValues}
                            onChange={onCheckboxChange}
                            name="dataValues"
                        />
                    }
                    label="Data Values"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={spectralSignature}
                            onChange={onCheckboxChange}
                            name="spectralSignature"
                        />
                    }
                    label="Spectral Signature"
                />
            </FormGroup>
        </Box>
    );
};

export default SatellitePropertiesForm;
