import { Employee, TrackingHistory } from "../types/employee";

// Employee route definitions - each employee follows a specific linear path
const employeeRoutes = {
  "1": {
    // John Doe - San Francisco route (Market Street to Golden Gate)
    startLat: 37.7849,
    startLng: -122.4094,
    endLat: 37.8199,
    endLng: -122.4783,
    name: "John Doe",
    cityAddress: "San Francisco, CA",
  },
  "2": {
    // Jane Smith - Los Angeles route (Downtown to Santa Monica)
    startLat: 34.0522,
    startLng: -118.2437,
    endLat: 34.0195,
    endLng: -118.4912,
    name: "Jane Smith",
    cityAddress: "Los Angeles, CA",
  },
  "3": {
    // Alice Johnson - New York route (Times Square to Central Park)
    startLat: 40.7589,
    startLng: -73.9851,
    endLat: 40.7812,
    endLng: -73.9665,
    name: "Alice Johnson",
    cityAddress: "New York, NY",
  },
};

// Global state to track current position index for each employee
let currentPositionIndexes: { [key: string]: number } = {
  "1": 30, // Start at middle (current position)
  "2": 30,
  "3": 30,
};

// Generate complete route with 61 points (30 past + 1 current + 30 future)
const generateEmployeeRoute = (employeeId: string): TrackingHistory[] => {
  const route = employeeRoutes[employeeId as keyof typeof employeeRoutes];
  if (!route) return [];

  const totalPoints = 61;
  const history: TrackingHistory[] = [];
  const now = new Date();

  // Calculate incremental steps for linear movement
  const latStep = (route.endLat - route.startLat) / (totalPoints - 1);
  const lngStep = (route.endLng - route.startLng) / (totalPoints - 1);

  for (let i = 0; i < totalPoints; i++) {
    // Calculate position along the route
    const latitude = route.startLat + latStep * i;
    const longitude = route.startLng + lngStep * i;

    // Calculate timestamp (past, present, future)
    const timeOffset = (i - 30) * 30 * 1000; // 30 seconds intervals
    const timestamp = new Date(now.getTime() + timeOffset);

    // Add slight random variation to make path more realistic
    const variation = 0.0001;
    const latVariation = (Math.random() - 0.5) * variation;
    const lngVariation = (Math.random() - 0.5) * variation;

    history.push({
      id: `${employeeId}-${i}`,
      timestamp: timestamp.toISOString(),
      location: {
        latitude: latitude + latVariation,
        longitude: longitude + lngVariation,
        address: `${route.cityAddress} - Point ${i + 1}`,
      },
      action: i === 0 ? "started" : "moved",
      speed: Math.random() * 20 + 25, // 25-45 km/h realistic city speed
    });
  }

  return history;
};

// Generate current snapshot of employee data
const generateCurrentEmployeeData = (): Employee[] => {
  return Object.keys(employeeRoutes).map((employeeId) => {
    const route = employeeRoutes[employeeId as keyof typeof employeeRoutes];
    const fullRoute = generateEmployeeRoute(employeeId);
    const currentIndex = currentPositionIndexes[employeeId];

    // Get past 30 entries for history (0 to 29)
    const pastHistory = fullRoute.slice(0, 30);

    // Current location is at index 30
    const currentLocation = fullRoute[currentIndex];

    return {
      id: employeeId,
      name: route.name,
      image: `https://i.pravatar.cc/150?img=${employeeId}`,
      currentLocation: {
        latitude: currentLocation.location.latitude,
        longitude: currentLocation.location.longitude,
        address: currentLocation.location.address,
      },
      history: pastHistory,
      isActive: true,
      startTime: new Date(Date.now() - 30 * 30 * 1000).toISOString(), // Started 30 intervals ago
      lastFetchTime: new Date().toISOString(),
    };
  });
};

// Initialize static employee data - this will be replaced by dynamic data
export const mockEmployees: Employee[] = generateCurrentEmployeeData();

// Function to advance all employees to their next position
const advanceEmployeePositions = () => {
  Object.keys(currentPositionIndexes).forEach((employeeId) => {
    // Move to next position (but don't go beyond index 60)
    if (currentPositionIndexes[employeeId] < 60) {
      currentPositionIndexes[employeeId]++;
    }
  });
};

// Auto-advance positions every 30 seconds
setInterval(() => {
  advanceEmployeePositions();
  console.log("Employee positions advanced:", currentPositionIndexes);
}, 30000);

export const getEmployees = (): Promise<Employee[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate fresh data based on current positions
      const updatedEmployees = Object.keys(employeeRoutes).map((employeeId) => {
        const route = employeeRoutes[employeeId as keyof typeof employeeRoutes];
        const fullRoute = generateEmployeeRoute(employeeId);
        const currentIndex = currentPositionIndexes[employeeId];

        // Ensure we don't go out of bounds
        const safeCurrentIndex = Math.min(currentIndex, fullRoute.length - 1);

        // Get history up to current position (everything before current index)
        const historyEndIndex = Math.max(0, safeCurrentIndex - 1);
        const historyStartIndex = Math.max(0, historyEndIndex - 29); // Last 30 history points
        const recentHistory = fullRoute.slice(
          historyStartIndex,
          historyEndIndex + 1
        );

        // Current location
        const currentLocation = fullRoute[safeCurrentIndex];

        // Add realistic address based on position progress
        const progressPercent =
          (safeCurrentIndex / (fullRoute.length - 1)) * 100;
        let addressSuffix = "";
        if (progressPercent < 25) addressSuffix = " - Starting Route";
        else if (progressPercent < 50) addressSuffix = " - Quarter Way";
        else if (progressPercent < 75) addressSuffix = " - Halfway Point";
        else if (progressPercent < 95) addressSuffix = " - Near Destination";
        else addressSuffix = " - Arriving at Destination";

        return {
          id: employeeId,
          name: route.name,
          image: `https://i.pravatar.cc/150?img=${employeeId}`,
          currentLocation: {
            latitude: currentLocation.location.latitude,
            longitude: currentLocation.location.longitude,
            address: route.cityAddress + addressSuffix,
          },
          history: recentHistory,
          isActive: true,
          startTime: new Date(
            Date.now() - safeCurrentIndex * 30 * 1000
          ).toISOString(),
          lastFetchTime: new Date().toISOString(),
        };
      });

      resolve(updatedEmployees);
    }, 200); // Faster response time for better UX
  });
};

export const getEmployeeById = (id: string): Employee | undefined => {
  const employees = generateCurrentEmployeeData();
  return employees.find((employee) => employee.id === id);
};

// Utility function to get current position progress for an employee
export const getEmployeeProgress = (
  employeeId: string
): { current: number; total: number; percentage: number } => {
  const current = currentPositionIndexes[employeeId] || 0;
  const total = 60; // 0-60 total positions
  const percentage = (current / total) * 100;

  return { current, total, percentage };
};

// Function to manually advance a specific employee (for testing)
export const advanceEmployee = (employeeId: string): void => {
  if (currentPositionIndexes[employeeId] < 60) {
    currentPositionIndexes[employeeId]++;
  }
};

// Function to reset all employees to starting position
export const resetEmployeePositions = (): void => {
  Object.keys(currentPositionIndexes).forEach((id) => {
    currentPositionIndexes[id] = 30; // Reset to middle position
  });
};
