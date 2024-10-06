import axios from 'axios';

export const getPreviewImages = async (coordinates: { lat: number, lon: number }) => {
    try {
        const response = await axios.post(`http://localhost:3000/preview`, {
            coordinates
        });

        const imagesBase64 = response.data.map((image: { type: string; data: number[] }) => {
            const buffer = new Uint8Array(image.data);
            const base64Image = Buffer.from(buffer).toString('base64');
            return `data:image/jpeg;base64,${base64Image}`;
        });

        return imagesBase64;
    } catch (error) {
        console.error('Error fetching preview images:', error);
        throw error;
    }
};
