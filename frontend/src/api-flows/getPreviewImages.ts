import axios from 'axios';

export const getPreviewImages = async (coordinates: { lat: number, lon: number }) => {
    try {
        const response = await axios.post(`http://localhost:3000/preview`, {
            coordinates
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching preview images:', error);
        throw error;
    }
};
