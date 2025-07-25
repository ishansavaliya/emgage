import React, { useEffect, useState } from 'react';
import { useLocationData } from '../../hooks/useLocationData';
import { Employee } from '../../types/employee';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const TrackingMap: React.FC = () => {
    const { locationData, refreshData } = useLocationData();
    const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        if (locationData.length > 0) {
            const averageLat = locationData.reduce((sum, emp) => sum + emp.location.lat, 0) / locationData.length;
            const averageLng = locationData.reduce((sum, emp) => sum + emp.location.lng, 0) / locationData.length;
            setMapCenter([averageLat, averageLng]);
        }
    }, [locationData]);

    return (
        <div className="w-full h-full">
            <MapContainer center={mapCenter} zoom={13} className="w-full h-full">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {locationData.map((employee: Employee) => (
                    <Marker key={employee.id} position={[employee.location.lat, employee.location.lng]}>
                        <Popup>
                            <div className="flex flex-col items-center">
                                <img src={employee.avatar} alt={employee.name} className="w-16 h-16 rounded-full" />
                                <h2 className="font-bold">{employee.name}</h2>
                                <p>{employee.currentLocation}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            <button onClick={refreshData} className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded">
                Refresh
            </button>
        </div>
    );
};

export default TrackingMap;