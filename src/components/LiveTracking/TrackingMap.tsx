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
import "../../styles/map.css";
import { format } from "date-fns";

// Fix leaflet marker icons and create custom avatar icons
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Function to create custom avatar icons
const createAvatarIcon = (imageUrl: string) => {
  return L.divIcon({
    html: `
      <div style="
        width: 40px; 
        height: 40px; 
        border-radius: 50%; 
        overflow: hidden; 
        border: 3px solid #3b82f6; 
        background: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <img 
          src="${imageUrl}" 
          style="
            width: 100%; 
            height: 100%; 
            object-fit: cover;
          " 
          alt="Employee"
        />
      </div>
    `,
    className: "custom-avatar-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

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
  timelineMode?: boolean;
  timelineIndex?: number;
}

const EmployeePath: React.FC<EmployeePathProps> = ({
  employee,
  timelineMode = false,
  timelineIndex = 0,
}) => {
  if (timelineMode) {
    // In timeline mode, show path up to current timeline index
    const historyUpToIndex = employee.history.slice(0, timelineIndex + 1);
    const pathPositions = historyUpToIndex.map(
      (entry) =>
        [entry.location.latitude, entry.location.longitude] as [number, number]
    );

    if (pathPositions.length < 2) return null;

    return (
      <Polyline
        positions={pathPositions}
        color="#2563eb"
        weight={4}
        opacity={0.8}
        dashArray="5, 5"
      >
        <Tooltip sticky>{employee.name}'s timeline path</Tooltip>
      </Polyline>
    );
  }

  // Normal mode - show recent history
  const recentHistory = [...employee.history].slice(0, 10).reverse();
  const pathPositions = recentHistory.map(
    (entry) =>
      [entry.location.latitude, entry.location.longitude] as [number, number]
  );
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
  const [mapZoom, setMapZoom] = useState<number>(13);

  // Timeline states
  const [timelineEmployee, setTimelineEmployee] = useState<Employee | null>(
    null
  );
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showTimeline, setShowTimeline] = useState(false);

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

  // Timeline effects
  useEffect(() => {
    let interval: number;
    if (isTimelinePlaying && timelineEmployee) {
      interval = window.setInterval(() => {
        setTimelineIndex((prev) => {
          if (prev >= timelineEmployee.history.length - 1) {
            setIsTimelinePlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimelinePlaying, timelineEmployee, playbackSpeed]);

  // Update map center to follow timeline position
  useEffect(() => {
    if (
      showTimeline &&
      timelineEmployee &&
      timelineEmployee.history[timelineIndex]
    ) {
      const currentPos = timelineEmployee.history[timelineIndex];
      setMapCenter([
        currentPos.location.latitude,
        currentPos.location.longitude,
      ]);
      setMapZoom(16);
    }
  }, [showTimeline, timelineEmployee, timelineIndex]);

  const handleEmployeeClick = (employee: Employee) => {
    // For mini popup, we'll just focus on the employee
    setMapCenter([
      employee.currentLocation.latitude,
      employee.currentLocation.longitude,
    ]);
    setMapZoom(16);
  };

  const handleStartTimeline = (employee: Employee) => {
    setTimelineEmployee(employee);
    setTimelineIndex(0);
    setShowTimeline(true);
    setIsTimelinePlaying(false);
  };

  const handlePlayPause = () => {
    setIsTimelinePlaying(!isTimelinePlaying);
  };

  const handleTimelineClose = () => {
    setShowTimeline(false);
    setTimelineEmployee(null);
    setIsTimelinePlaying(false);
    setTimelineIndex(0);
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
        {employees.map((employee: Employee) => {
          // If this employee is in timeline mode, show timeline path
          if (
            showTimeline &&
            timelineEmployee &&
            timelineEmployee.id === employee.id
          ) {
            return (
              <EmployeePath
                key={`timeline-path-${employee.id}`}
                employee={employee}
                timelineMode={true}
                timelineIndex={timelineIndex}
              />
            );
          }
          // Otherwise show normal recent path
          return (
            <EmployeePath key={`path-${employee.id}`} employee={employee} />
          );
        })}

        {/* Render markers for each employee */}
        {employees.map((employee: Employee) => (
          <Marker
            key={employee.id}
            position={[
              employee.currentLocation.latitude,
              employee.currentLocation.longitude,
            ]}
            icon={createAvatarIcon(employee.image)}
            eventHandlers={{
              click: () => handleEmployeeClick(employee),
            }}
            // Make focused employee's marker more visible
            opacity={focusEmployeeId === employee.id ? 1 : 0.8}
            zIndexOffset={focusEmployeeId === employee.id ? 1000 : 0}
          >
            <Popup className="employee-popup" minWidth={300}>
              <div className="p-2 max-w-xs">
                {/* Employee Header */}
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={employee.image}
                    alt={employee.name}
                    className="w-12 h-12 rounded-full border-2 border-blue-500"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {employee.name}
                    </h3>
                    <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                      Always Active
                    </span>
                  </div>
                </div>

                {/* Location Info */}
                <div className="mb-3 text-sm text-gray-600">
                  <p className="mb-1">
                    📍{" "}
                    {employee.currentLocation.address ||
                      `${employee.currentLocation.latitude.toFixed(
                        4
                      )}, ${employee.currentLocation.longitude.toFixed(4)}`}
                  </p>
                  {employee.lastFetchTime && (
                    <p className="text-xs text-gray-500">
                      Last update:{" "}
                      {new Date(employee.lastFetchTime).toLocaleTimeString()}
                    </p>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="mb-3">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">
                    Recent Activity
                  </h4>
                  <div className="max-h-24 overflow-y-auto space-y-1">
                    {employee.history.slice(0, 3).map((record) => (
                      <div
                        key={record.id}
                        className="text-xs bg-gray-50 p-2 rounded"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            {record.action === "started"
                              ? "🟢 Started"
                              : "📍 Moved"}
                          </span>
                          <span className="text-gray-500">
                            {new Date(record.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        {record.speed && (
                          <p className="text-gray-500 mt-1">
                            Speed: {record.speed.toFixed(1)} km/h
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleStartTimeline(employee);
                    }}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    📊 Play Timeline
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Timeline marker - shows current position during timeline playback */}
        {showTimeline &&
          timelineEmployee &&
          timelineEmployee.history[timelineIndex] && (
            <Marker
              position={[
                timelineEmployee.history[timelineIndex].location.latitude,
                timelineEmployee.history[timelineIndex].location.longitude,
              ]}
              icon={L.divIcon({
                html: `
                <div style="
                  width: 50px; 
                  height: 50px; 
                  border-radius: 50%; 
                  overflow: hidden; 
                  border: 4px solid #2563eb; 
                  background: white;
                  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.5);
                  position: relative;
                ">
                  <img 
                    src="${timelineEmployee.image}" 
                    style="
                      width: 100%; 
                      height: 100%; 
                      object-fit: cover;
                    " 
                    alt="Timeline"
                  />
                  <div style="
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 16px;
                    height: 16px;
                    background: #2563eb;
                    border-radius: 50%;
                    border: 2px solid white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 8px;
                    color: white;
                  ">
                    ▶
                  </div>
                </div>
              `,
                className: "timeline-marker",
                iconSize: [50, 50],
                iconAnchor: [25, 25],
                popupAnchor: [0, -25],
              })}
              zIndexOffset={2000}
            >
              <Popup>
                <div className="text-center">
                  <h4 className="font-bold text-blue-600">Timeline Position</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(
                      timelineEmployee.history[timelineIndex].timestamp
                    ).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Step {timelineIndex + 1} of{" "}
                    {timelineEmployee.history.length}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}
      </MapContainer>
      <button
        onClick={refreshData}
        className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded shadow-lg hover:bg-blue-600 transition z-[1000]"
      >
        🔄 Refresh
      </button>

      {/* Timeline Controls Overlay */}
      {showTimeline && timelineEmployee && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4 z-[1000] border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <img
                src={timelineEmployee.image}
                alt={timelineEmployee.name}
                className="w-10 h-10 rounded-full border-2 border-blue-500"
              />
              <div>
                <h3 className="font-bold text-gray-800">
                  {timelineEmployee.name}
                </h3>
                <p className="text-sm text-gray-600">Timeline Player</p>
              </div>
            </div>
            <button
              onClick={handleTimelineClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Timeline Progress */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>
                Step {timelineIndex + 1} of {timelineEmployee.history.length}
              </span>
              <span>Speed: {playbackSpeed}x</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((timelineIndex + 1) / timelineEmployee.history.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <input
              type="range"
              min={0}
              max={timelineEmployee.history.length - 1}
              value={timelineIndex}
              onChange={(e) => setTimelineIndex(parseInt(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          {/* Current Timeline Info */}
          {timelineEmployee.history[timelineIndex] && (
            <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
              <p className="font-medium text-gray-800">
                {new Date(
                  timelineEmployee.history[timelineIndex].timestamp
                ).toLocaleString()}
              </p>
              <p className="text-gray-600">
                📍{" "}
                {timelineEmployee.history[timelineIndex].location.address ||
                  `${timelineEmployee.history[
                    timelineIndex
                  ].location.latitude.toFixed(4)}, ${timelineEmployee.history[
                    timelineIndex
                  ].location.longitude.toFixed(4)}`}
              </p>
              {timelineEmployee.history[timelineIndex].speed && (
                <p className="text-gray-600">
                  🚗 Speed:{" "}
                  {timelineEmployee.history[timelineIndex].speed.toFixed(1)}{" "}
                  km/h
                </p>
              )}
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => setTimelineIndex(Math.max(0, timelineIndex - 1))}
              disabled={timelineIndex === 0}
              className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⏮
            </button>
            <button
              onClick={handlePlayPause}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isTimelinePlaying ? "⏸️" : "▶️"}
            </button>
            <button
              onClick={() =>
                setTimelineIndex(
                  Math.min(
                    timelineEmployee.history.length - 1,
                    timelineIndex + 1
                  )
                )
              }
              disabled={timelineIndex === timelineEmployee.history.length - 1}
              className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⏭
            </button>
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={5}>5x</option>
              <option value={10}>10x</option>
            </select>
          </div>

          {/* Timeline Visualization */}
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Travel Path
            </h4>
            <div className="relative h-20 bg-white rounded border overflow-hidden">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 400 80"
                className="absolute inset-0"
              >
                {(() => {
                  if (timelineEmployee.history.length < 2) return null;

                  const lats = timelineEmployee.history.map(
                    (h) => h.location.latitude
                  );
                  const lngs = timelineEmployee.history.map(
                    (h) => h.location.longitude
                  );
                  const minLat = Math.min(...lats);
                  const maxLat = Math.max(...lats);
                  const minLng = Math.min(...lngs);
                  const maxLng = Math.max(...lngs);
                  const latRange = maxLat - minLat || 0.01;
                  const lngRange = maxLng - minLng || 0.01;

                  return (
                    <>
                      {/* Draw path lines */}
                      {timelineEmployee.history.map((record, index) => {
                        if (index === 0) return null;
                        const prevRecord = timelineEmployee.history[index - 1];
                        const x1 =
                          ((prevRecord.location.longitude - minLng) /
                            lngRange) *
                            360 +
                          20;
                        const y1 =
                          ((maxLat - prevRecord.location.latitude) / latRange) *
                            40 +
                          20;
                        const x2 =
                          ((record.location.longitude - minLng) / lngRange) *
                            360 +
                          20;
                        const y2 =
                          ((maxLat - record.location.latitude) / latRange) *
                            40 +
                          20;

                        return (
                          <line
                            key={`line-${index}`}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke={
                              index <= timelineIndex ? "#ef4444" : "#d1d5db"
                            }
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        );
                      })}

                      {/* Draw position points */}
                      {timelineEmployee.history.map((record, index) => {
                        const x =
                          ((record.location.longitude - minLng) / lngRange) *
                            360 +
                          20;
                        const y =
                          ((maxLat - record.location.latitude) / latRange) *
                            40 +
                          20;

                        return (
                          <circle
                            key={`point-${index}`}
                            cx={x}
                            cy={y}
                            r={index === timelineIndex ? 6 : 3}
                            fill={
                              index === timelineIndex
                                ? "#2563eb"
                                : index === 0
                                ? "#22c55e"
                                : index === timelineEmployee.history.length - 1
                                ? "#f59e0b"
                                : "#ef4444"
                            }
                            stroke="white"
                            strokeWidth="1"
                          />
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
              <div className="absolute bottom-1 left-2 text-xs text-gray-600">
                🟢 Start → 🔴 Path → 🔵 Current → 🟠 End
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingMap;
