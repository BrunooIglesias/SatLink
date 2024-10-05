import dynamic from 'next/dynamic';
import { useState } from "react";

const MapComponent = dynamic(() => import("@/components/map/map"), { ssr: false });
const UserDetailsPanel = dynamic(() => import("@/components/user-details-panel/UserDetailsPanel"), { ssr: false });
import Navbar from "@/components/navbar/navbar";

const MapContainer: React.FC = () => {
    const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });

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

    const handleSubmit = () => {
        console.log('Form Data:', formData);
        setIsPanelOpen(false);
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
            />
        </div>
    );
};

export default MapContainer;
