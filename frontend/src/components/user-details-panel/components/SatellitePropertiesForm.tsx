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
    fromDate: string;
    toDate: string;
    onSatelliteChange: (key: string, value: any) => void;  // Updated to use key and value
}

const SatellitePropertiesForm: React.FC<SatellitePropertiesFormProps> = ({
                                                                             satellite,
                                                                             cloudThreshold,
                                                                             mostRecentImage,
                                                                             metadata,
                                                                             dataValues,
                                                                             spectralSignature,
                                                                             fromDate,
                                                                             toDate,
                                                                             onSatelliteChange,
                                                                         }) => {
    return (
        <Box>
            <FormControl fullWidth margin="normal">
                <InputLabel>Select Satellite</InputLabel>
                <Select
                    value={satellite}
                    onChange={(e) => onSatelliteChange('satellite', e.target.value)} // Update with key
                    label="Satellite"
                >
                    <MenuItem value="landsat9">Landsat 9</MenuItem>
                    <MenuItem value="landsat8">Landsat 8</MenuItem>
                    <MenuItem value="hsla">HSLA</MenuItem>
                </Select>
            </FormControl>

            <TextField
                label="Cloud Threshold (0-100)"
                type="number"
                value={cloudThreshold}
                onChange={(e) => onSatelliteChange('cloudThreshold', e.target.value)}  // Update with key
                fullWidth
                margin="normal"
                inputProps={{ min: 0, max: 100 }} // Add input range
            />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={mostRecentImage}
                        onChange={(e) => onSatelliteChange('mostRecentImage', e.target.checked)}  // Update with key
                        name="mostRecentImage"
                    />
                }
                label="Most Recent Image"
            />

            {!mostRecentImage && (
                <Box>
                    <TextField
                        label="From Date"
                        type="date"
                        value={fromDate}
                        onChange={(e) => onSatelliteChange('fromDate', e.target.value)}  // Update with key
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="To Date"
                        type="date"
                        value={toDate}
                        onChange={(e) => onSatelliteChange('toDate', e.target.value)}  // Update with key
                        fullWidth
                        margin="normal"
                    />
                </Box>
            )}

            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={metadata}
                            onChange={(e) => onSatelliteChange('metadata', e.target.checked)}  // Update with key
                            name="metadata"
                        />
                    }
                    label="Metadata"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={dataValues}
                            onChange={(e) => onSatelliteChange('dataValues', e.target.checked)}  // Update with key
                            name="dataValues"
                        />
                    }
                    label="Data Values"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={spectralSignature}
                            onChange={(e) => onSatelliteChange('spectralSignature', e.target.checked)}  // Update with key
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
