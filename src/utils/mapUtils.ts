// This file contains utility functions for handling map-related operations.

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};

const degreesToRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
};

export const getMapCenter = (locations: { lat: number; lon: number }[]): { lat: number; lon: number } => {
    const latSum = locations.reduce((sum, loc) => sum + loc.lat, 0);
    const lonSum = locations.reduce((sum, loc) => sum + loc.lon, 0);
    return {
        lat: latSum / locations.length,
        lon: lonSum / locations.length,
    };
};