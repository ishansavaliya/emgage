import React, { useEffect, useState } from "react";
import { useLocationData } from "../../hooks/useLocationData";
import { Employee } from "../../types/employee";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const TrackingMap: React.FC = () => {
  const { employees, refreshData } = useLocationData();
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    37.7749, -122.4194,
  ]);

  useEffect(() => {
    if (employees.length > 0) {
      const averageLat =
        employees.reduce((sum, emp) => sum + emp.currentLocation.latitude, 0) /
        employees.length;
      const averageLng =
        employees.reduce((sum, emp) => sum + emp.currentLocation.longitude, 0) /
        employees.length;
      setMapCenter([averageLat, averageLng]);
    }
  }, [employees]);

  return (
    <div className="w-full h-full relative">
      <MapContainer center={mapCenter} zoom={13} className="w-full h-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {employees.map((employee: Employee) => (
          <Marker
            key={employee.id}
            position={[
              employee.currentLocation.latitude,
              employee.currentLocation.longitude,
            ]}
          >
            <Popup>
              <div className="flex flex-col items-center">
                <img
                  src={employee.image}
                  alt={employee.name}
                  className="w-16 h-16 rounded-full mb-2"
                />
                <h2 className="font-bold text-center">{employee.name}</h2>
                <p className="text-sm text-gray-600 text-center">
                  {employee.currentLocation.address ||
                    `${employee.currentLocation.latitude.toFixed(
                      4
                    )}, ${employee.currentLocation.longitude.toFixed(4)}`}
                </p>
                <span
                  className={`px-2 py-1 rounded text-sm mt-1 ${
                    employee.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {employee.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <button
        onClick={refreshData}
        className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded shadow-lg hover:bg-blue-600 transition z-[1000]"
      >
        🔄 Refresh
      </button>
    </div>
  );
};

export default TrackingMap;
