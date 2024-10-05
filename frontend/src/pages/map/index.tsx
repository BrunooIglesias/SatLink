import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('@/containers/map/MapContainer'), {
    ssr: false,
});

const MapPage: React.FC = () => {
    return <MapContainer />;
};

export default MapPage;
