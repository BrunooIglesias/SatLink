import MapComponent from "@/components/map/map";

const MapContainer: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-6">OpenStreetMap with Leaflet</h1>
            <MapComponent />
        </div>
    );
};

export default MapContainer;
