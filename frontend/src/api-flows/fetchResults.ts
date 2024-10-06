import axios from 'axios';

export const fetchResults = async (id: string) => {
    try {
        const response = await axios.get(`http://localhost:3000/results/${id}`);

        const buffer = new Uint8Array(response.data.image.data);
        const base64Image = Buffer.from(buffer).toString('base64');
        const imageWithBase64 = `data:image/jpeg;base64,${base64Image}`;

        return {
            ...response.data,
            image: imageWithBase64,
        };
    } catch (error) {
        console.error('Error fetching results:', error);
        throw error;
    }
};
