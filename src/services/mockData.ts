import { Employee, TrackingHistory } from "../types/employee";

// Generate realistic tracking history for each employee with more data points
const generateTrackingHistory = (
  baseLocation: { latitude: number; longitude: number },
  employeeId: string
): TrackingHistory[] => {
  const history: TrackingHistory[] = [];
  const now = new Date();

  // Generate more history data points (50 entries instead of 10)
  for (let i = 0; i < 50; i++) {
    const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000); // 30 minutes intervals

    // Create a more realistic path with larger movements for better visualization
    const pathOffset = i * 0.002; // Gradual movement across the map
    const randomOffset = (Math.random() - 0.5) * 0.005;

    history.push({
      id: `${employeeId}-${i}`,
      timestamp: timestamp.toISOString(),
      location: {
        latitude: baseLocation.latitude + pathOffset + randomOffset,
        longitude: baseLocation.longitude + pathOffset + randomOffset,
        address: `Location ${i + 1}`,
      },
      action: i === 0 ? "started" : "moved", // Always keep tracking active, no stops
      speed: Math.random() * 60 + 10, // km/h (10-70 km/h)
    });
  }

  return history.reverse();
};

export const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "John Doe",
    image: "https://i.pravatar.cc/150?img=1",
    currentLocation: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: "San Francisco, CA",
    },
    history: generateTrackingHistory(
      { latitude: 37.7749, longitude: -122.4194 },
      "1"
    ),
    isActive: true,
    startTime: "2024-01-25T08:00:00Z",
    lastFetchTime: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Jane Smith",
    image: "https://i.pravatar.cc/150?img=2",
    currentLocation: {
      latitude: 34.0522,
      longitude: -118.2437,
      address: "Los Angeles, CA",
    },
    history: generateTrackingHistory(
      { latitude: 34.0522, longitude: -118.2437 },
      "2"
    ),
    isActive: true,
    startTime: "2024-01-25T08:30:00Z",
    lastFetchTime: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Alice Johnson",
    image: "https://i.pravatar.cc/150?img=3",
    currentLocation: {
      latitude: 40.7128,
      longitude: -74.006,
      address: "New York, NY",
    },
    history: generateTrackingHistory(
      { latitude: 40.7128, longitude: -74.006 },
      "3"
    ),
    isActive: true, // Always active - location can't be turned off
    startTime: "2024-01-25T09:00:00Z",
    lastFetchTime: new Date().toISOString(),
  },
];

export const getEmployees = (): Promise<Employee[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate API response with updated locations and new history entries
      const updatedEmployees = mockEmployees.map((emp) => {
        // Create new location with slight movement
        const newLocation = {
          latitude:
            emp.currentLocation.latitude + (Math.random() - 0.5) * 0.001,
          longitude:
            emp.currentLocation.longitude + (Math.random() - 0.5) * 0.001,
          address: emp.currentLocation.address,
        };

        // Create new history entry
        const newHistoryEntry: TrackingHistory = {
          id: `${emp.id}-${Date.now()}`,
          timestamp: new Date().toISOString(),
          location: newLocation,
          action: "moved",
          speed: Math.random() * 60 + 10, // 10-70 km/h
        };

        // Add new entry to history (keep last 50 entries)
        const updatedHistory = [newHistoryEntry, ...emp.history].slice(0, 50);

        return {
          ...emp,
          currentLocation: newLocation,
          history: updatedHistory,
          lastFetchTime: new Date().toISOString(),
        };
      });
      resolve(updatedEmployees);
    }, 500);
  });
};

export const getEmployeeById = (id: string): Employee | undefined => {
  return mockEmployees.find((employee) => employee.id === id);
};
