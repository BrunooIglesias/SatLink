import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
    onMapClick: (lat: number, lng: number) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onMapClick }) => {
    useEffect(() => {
        let map: L.Map | undefined;

        if (!map) {
            map = L.map('map', {
                center: [40, -100],
                zoom: 4,
                zoomControl: true,
                attributionControl: false,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }).addTo(map);

            map.on('click', function (e: any) {
                const { lat, lng } = e.latlng;
                onMapClick(lat, lng);
            });

            map.getContainer().style.cursor = 'url(https://maps.gstatic.com/mapfiles/openhand_8_8.cur), default';
        }

        return () => {
            if (map) {
                map.remove();
            }
        };
    }, [onMapClick]);

    return (
        <div id="map" style={{ width: '100vw', height: '100vh' }}></div>
    );
};

export default MapComponent;
