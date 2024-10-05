import { useState } from "react";
import MapComponent from "@/components/map/map";
import Navbar from "@/components/navbar/navbar";

const MapContainer: React.FC = () => {
    const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);

    const handleMapClick = (lat: number, lng: number) => {
        console.log(`Latitud: ${lat}, Longitud: ${lng}`);
        setLatLng({ lat, lng });
    };

    return (
        <div className="flex flex-col h-screen">
           <Navbar/>

            <div className="flex-1">
                <MapComponent onMapClick={handleMapClick} />
            </div>

            {latLng && (
                <footer className="bg-gray-100 text-center py-2">
                    <p>Latitud: {latLng.lat}, Longitud: {latLng.lng}</p>
                </footer>
            )}
        </div>
    );
};

export default MapContainer;
