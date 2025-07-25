export interface TrackingData {
    employeeId: string;
    location: {
        latitude: number;
        longitude: number;
    };
    timestamp: string;
    speed?: number; // Optional: speed of the employee if available
}

export interface TrackingHistory {
    employeeId: string;
    history: Array<{
        location: {
            latitude: number;
            longitude: number;
        };
        timestamp: string;
    }>;
}