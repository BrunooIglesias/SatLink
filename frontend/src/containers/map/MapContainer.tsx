import dynamic from 'next/dynamic';
import { useState } from "react";
import {createUserRequest} from "@/api-flows/userRequest";

const MapComponent = dynamic(() => import("@/components/map/map"), { ssr: false });
const UserDetailsPanel = dynamic(() => import("@/components/user-details-panel/UserDetailsPanel"), { ssr: false });

const MapContainer: React.FC = () => {
    const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
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
        }

        try {
            const response = await createUserRequest(data);
            console.log('Response from API:', response);

            setIsPanelOpen(false);
        } catch (error) {
            console.error('Error submitting user request:', error);
        }
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
            />
        </div>
    );
};

export default MapContainer;
