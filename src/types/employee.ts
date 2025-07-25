
export interface Employee {
    id: string;
    name: string;
    image: string;
    currentLocation: Location;
    history: TrackingHistory[];
    isActive: boolean;
    startTime?: string;
    stopTime?: string;
}

export interface Location {
    latitude: number;
    longitude: number;
    address?: string;
}

export interface TrackingHistory {
    id: string;
    timestamp: string;
    location: Location;
    action: 'started' | 'stopped' | 'moved';
    speed?: number;
}