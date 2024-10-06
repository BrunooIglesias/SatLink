import axios from 'axios';

export const getPreviewImages = async (coordinates: { lat: string, lng: string }) => {
    try {
        const response = await axios.post(`http://localhost:3000/preview`, {
            coordinates: coordinates
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching preview images:', error);
        throw error;
    }
};
