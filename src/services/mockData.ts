import { Employee, TrackingHistory } from "../types/employee";

// Generate realistic tracking history for each employee
const generateTrackingHistory = (
  baseLocation: { latitude: number; longitude: number },
  employeeId: string
): TrackingHistory[] => {
  const history: TrackingHistory[] = [];
  const now = new Date();

  for (let i = 0; i < 10; i++) {
    const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000); // 30 minutes intervals
    history.push({
      id: `${employeeId}-${i}`,
      timestamp: timestamp.toISOString(),
      location: {
        latitude: baseLocation.latitude + (Math.random() - 0.5) * 0.01,
        longitude: baseLocation.longitude + (Math.random() - 0.5) * 0.01,
        address: `Location ${i + 1}`,
      },
      action: i === 0 ? "started" : Math.random() > 0.8 ? "stopped" : "moved",
      speed: Math.random() * 60, // km/h
    });
  }

  return history.reverse();
};

export const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "John Doe",
    image: "/employee-avatars/john-doe.jpg",
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
  },
  {
    id: "2",
    name: "Jane Smith",
    image: "/employee-avatars/jane-smith.jpg",
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
  },
  {
    id: "3",
    name: "Alice Johnson",
    image: "/employee-avatars/alice-johnson.jpg",
    currentLocation: {
      latitude: 40.7128,
      longitude: -74.006,
      address: "New York, NY",
    },
    history: generateTrackingHistory(
      { latitude: 40.7128, longitude: -74.006 },
      "3"
    ),
    isActive: false,
    startTime: "2024-01-25T09:00:00Z",
    stopTime: "2024-01-25T17:00:00Z",
  },
];

export const getEmployees = (): Promise<Employee[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate API response with slight location changes
      const updatedEmployees = mockEmployees.map((emp) => ({
        ...emp,
        currentLocation: {
          ...emp.currentLocation,
          latitude:
            emp.currentLocation.latitude + (Math.random() - 0.5) * 0.001,
          longitude:
            emp.currentLocation.longitude + (Math.random() - 0.5) * 0.001,
        },
      }));
      resolve(updatedEmployees);
    }, 500);
  });
};

export const getEmployeeById = (id: string): Employee | undefined => {
  return mockEmployees.find((employee) => employee.id === id);
};
