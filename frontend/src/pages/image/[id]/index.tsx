import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ImageContainer from "@/containers/image/ImageContainer";
import { fetchResults } from "@/api-flows/fetchResults";
import { CircularProgress, Box } from '@mui/material';

const ImagePage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [imageData, setImageData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    const result = await fetchResults(id as string);
                    if (result) {
                        setImageData(result);
                    }
                } catch (error) {
                    console.error("Error fetching image data:", error);
                }
            }
        };

        fetchData();
    }, [id]);

    if (!imageData) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    color: 'white',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return <ImageContainer imageData={imageData} />;
};

export default ImagePage;
