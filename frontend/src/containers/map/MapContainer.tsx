import MapComponent from "@/components/map/map";

const MapContainer: React.FC = () => {
    return (
        <div className="flex flex-col h-screen">
            <header className="bg-gray-800 text-white text-center py-4">
                <h1 className="text-2xl font-bold">Get your Landsat img!</h1>
            </header>

            <div className="flex-1">
                <MapComponent />
            </div>
        </div>
    );
};

export default MapContainer;
