import axios from 'axios';

export const createUserRequest = async (data: any) => {
    try {
        const response = await axios.post('/userRequest', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response;
    } catch (error) {
        console.error('Error in createUserRequest:', error);
        throw error;
    }
};
