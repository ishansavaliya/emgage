export interface Location {
    employeeId: string;
    latitude: number;
    longitude: number;
    timestamp: Date;
}

export interface EmployeeLocation {
    employeeId: string;
    locations: Location[];
}