import axios from 'axios';

export const fetchResults = async (id: string) => {
    try {
        const response = await axios.get(`http://localhost:3000/results/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching results:', error);
        throw error;
    }
};
