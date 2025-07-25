import axios from 'axios';
import { EmployeeLocation } from '../types/location';

const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

export const fetchEmployeeLocations = async (): Promise<EmployeeLocation[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/employee-locations`);
        return response.data;
    } catch (error) {
        console.error('Error fetching employee locations:', error);
        throw error;
    }
};

export const fetchEmployeeHistory = async (employeeId: string): Promise<any> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/employee-history/${employeeId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching history for employee ${employeeId}:`, error);
        throw error;
    }
};