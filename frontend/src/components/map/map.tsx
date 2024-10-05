import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from '../../public/leaflet/marker-icon.png';
import markerShadow from '../../public/leaflet/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon.src,
    shadowUrl: markerShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface MapComponentProps {
    onMapClick: (lat: number, lng: number) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onMapClick }) => {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (mapRef.current === null) {
            const map = L.map('map', {
                center: [40, -100],
                zoom: 4,
                zoomControl: false,
                attributionControl: false,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }).addTo(map);

            map.on('click', function (e: any) {
                const { lat, lng } = e.latlng;
                onMapClick(lat, lng);

                map.setView([lat, lng], map.getZoom());

                if (markerRef.current) {
                    map.removeLayer(markerRef.current);
                }

                const newMarker = L.marker([lat, lng], { icon: DefaultIcon }).addTo(map);

                markerRef.current = newMarker;
            });

            map.getContainer().style.cursor = 'url(https://maps.gstatic.com/mapfiles/openhand_8_8.cur), default';

            mapRef.current = map;
        }
    }, [onMapClick]);

    return (
        <div id="map" style={{ width: '100vw', height: '100vh' }}></div>
    );
};

export default MapComponent;
