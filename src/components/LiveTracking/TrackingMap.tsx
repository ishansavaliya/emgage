import React, { useEffect, useState } from "react";
import { useLocationData } from "../../hooks/useLocationData";
import { Employee } from "../../types/employee";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-polylinedecorator";
import HistoryPopup from "../History/HistoryPopup";

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

// Custom component to set map view when center or zoom changes
const MapUpdater: React.FC<{ center: [number, number]; zoom?: number }> = ({
  center,
  zoom,
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

interface EmployeePathProps {
  employee: Employee;
}

const EmployeePath: React.FC<EmployeePathProps> = ({ employee }) => {
  // Get the most recent history points (last 10 entries)
  const recentHistory = [...employee.history].slice(0, 10).reverse();

  // Create an array of positions for the polyline
  const pathPositions = recentHistory.map(
    (entry) =>
      [entry.location.latitude, entry.location.longitude] as [number, number]
  );

  // Add current location to the end of the path
  pathPositions.push([
    employee.currentLocation.latitude,
    employee.currentLocation.longitude,
  ]);

  return (
    <Polyline
      positions={pathPositions}
      color="red"
      weight={3}
      opacity={0.7}
      dashArray="10, 10"
    >
      <Tooltip sticky>{employee.name}'s recent path</Tooltip>
    </Polyline>
  );
};

interface TrackingMapProps {
  focusEmployeeId?: string; // Optional ID of employee to focus on
}

const TrackingMap: React.FC<TrackingMapProps> = ({ focusEmployeeId }) => {
  const { employees, refreshData } = useLocationData();
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    37.7749, -122.4194,
  ]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [mapZoom, setMapZoom] = useState<number>(13);

  // Set initial map center based on average employee positions
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

  // Focus on specific employee when focusEmployeeId changes
  useEffect(() => {
    if (focusEmployeeId && employees.length > 0) {
      const employeeToFocus = employees.find(
        (emp) => emp.id === focusEmployeeId
      );
      if (employeeToFocus) {
        setMapCenter([
          employeeToFocus.currentLocation.latitude,
          employeeToFocus.currentLocation.longitude,
        ]);
        setMapZoom(16); // Zoom in closer to the employee
      }
    }
  }, [focusEmployeeId, employees]);

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowHistory(true);
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer center={mapCenter} zoom={mapZoom} className="w-full h-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapUpdater center={mapCenter} zoom={mapZoom} />

        {/* Render path polylines for each employee */}
        {employees.map((employee: Employee) => (
          <EmployeePath key={`path-${employee.id}`} employee={employee} />
        ))}

        {/* Render markers for each employee */}
        {employees.map((employee: Employee) => (
          <Marker
            key={employee.id}
            position={[
              employee.currentLocation.latitude,
              employee.currentLocation.longitude,
            ]}
            eventHandlers={{
              click: () => handleEmployeeClick(employee),
            }}
            // Make focused employee's marker more visible
            opacity={focusEmployeeId === employee.id ? 1 : 0.8}
            zIndexOffset={focusEmployeeId === employee.id ? 1000 : 0}
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
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleEmployeeClick(employee);
                  }}
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  View History
                </button>
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

      {/* History popup rendered directly inside the map component */}
      {selectedEmployee && (
        <HistoryPopup
          open={showHistory}
          onClose={handleCloseHistory}
          employee={selectedEmployee}
        />
      )}
    </div>
  );
};

export default TrackingMap;
