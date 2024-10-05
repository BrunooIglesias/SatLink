import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent: React.FC = () => {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const map = L.map('map', {
                center: [40, -100],
                zoom: 4,
                zoomControl: true,
                attributionControl: false,
            });

            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 19,
            }).addTo(map);
        }
    }, []);

    return (
        <div id="map" style={{ width: '100vw', height: '100vh' }}></div>
    );
};

export default MapComponent;
