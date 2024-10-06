import dynamic from 'next/dynamic';
import { useState } from "react";
import { createUserRequest } from "@/api-flows/userRequest";
import { getPreviewImages } from "@/api-flows/getPreviewImages";

const MapComponent = dynamic(() => import("@/components/map/map"), { ssr: false });
const UserDetailsPanel = dynamic(() => import("@/components/user-details-panel/UserDetailsPanel"), { ssr: false });
const ImagePreviewPanel = dynamic(() => import("@/components/image-preview-panel/ImagePreviewPanel"), { ssr: false });

const MapContainer: React.FC = () => {
    const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isPreviewPanelOpen, setIsPreviewPanelOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [satelliteData, setSatelliteData] = useState({
        satellite: '',
        cloudThreshold: '',
        mostRecentImage: true,
        metadata: false,
        dataValues: false,
        spectralSignature: false,
        fromDate: '',
        toDate: '',
    });
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    const handleMapClick = (lat: number, lng: number) => {
        setLatLng({ lat, lng });
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSatelliteChange = (key: string, value: any) => {
        setSatelliteData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        const data = {
            latitude: latLng?.lat,
            longitude: latLng?.lng,
            name: formData.name,
            email: formData.email,
            satellite: satelliteData.satellite,
            cloudThreshold: satelliteData.cloudThreshold,
            mostRecent: satelliteData.mostRecentImage,
            metadata: satelliteData.metadata,
            dataValues: satelliteData.dataValues,
            spectralSignature: satelliteData.spectralSignature,
            fromDate: satelliteData.fromDate,
            toDate: satelliteData.toDate,
        };

        try {
            await createUserRequest(data);

            /*
            const coordinates = {
                lat: latLng?.lat || 0,
                lon: latLng?.lng || 0
            };
            const previewResponse = await getPreviewImages(coordinates);

            setPreviewImages(previewResponse.data.images);

             */

            setIsPanelOpen(false);
            //setIsPreviewPanelOpen(true);
        } catch (error) {
            console.error('Error submitting user request:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClosePreviewPanel = () => {
        setIsPreviewPanelOpen(false);
    };

    return (
        <div className="relative flex-1">
            <MapComponent onMapClick={handleMapClick} />
            <UserDetailsPanel
                isOpen={isPanelOpen}
                onClose={handleClosePanel}
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                latLng={latLng}
                satelliteData={satelliteData}
                onSatelliteChange={handleSatelliteChange}
                isLoading={isLoading}
            />
            <ImagePreviewPanel
                isOpen={isPreviewPanelOpen}
                onClose={handleClosePreviewPanel}
                previewImages={previewImages}
            />
        </div>
    );
};

export default MapContainer;
