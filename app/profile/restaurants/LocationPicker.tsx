"use client";

import { useEffect } from "react";
import L from "leaflet";
import {
    MapContainer,
    Marker,
    TileLayer,
    useMap,
    useMapEvents,
} from "react-leaflet";

type LocationPickerProps = {
    latitude: string;
    longitude: string;
    onSelect: (latitude: number, longitude: number) => void;
    readOnly?: boolean;
};

const markerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function MapClickHandler({ onSelect, readOnly }: Pick<LocationPickerProps, "onSelect" | "readOnly">) {
    useMapEvents({
        click(event) {
            if (readOnly) return;
            onSelect(event.latlng.lat, event.latlng.lng);
        },
    });
    return null;
}

function RecenterMap({ latitude, longitude }: Pick<LocationPickerProps, "latitude" | "longitude">) {
    const map = useMap();
    const numericLatitude = Number(latitude);
    const numericLongitude = Number(longitude);

    useEffect(() => {
        if (Number.isFinite(numericLatitude) && Number.isFinite(numericLongitude)) {
            map.setView([numericLatitude, numericLongitude], Math.max(map.getZoom(), 13));
        }
    }, [map, numericLatitude, numericLongitude]);

    return null;
}

export default function LocationPicker({ latitude, longitude, onSelect, readOnly = false }: LocationPickerProps) {
    const numericLatitude = Number(latitude);
    const numericLongitude = Number(longitude);
    const hasSelection = Number.isFinite(numericLatitude) && Number.isFinite(numericLongitude);
    const center: [number, number] = hasSelection
        ? [numericLatitude, numericLongitude]
        : [20, 0];

    return (
        <div className="location-picker">
            <p>{readOnly ? "Restaurant location" : "Click the map to pin the restaurant location."}</p>
            <MapContainer center={center} zoom={hasSelection ? 13 : 2} scrollWheelZoom className="location-map">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onSelect={onSelect} readOnly={readOnly} />
                <RecenterMap latitude={latitude} longitude={longitude} />
                {hasSelection && <Marker position={[numericLatitude, numericLongitude]} icon={markerIcon} />}
            </MapContainer>
        </div>
    );
}
