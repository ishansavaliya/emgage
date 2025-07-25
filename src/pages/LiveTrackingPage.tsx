import React, { useEffect, useState } from 'react';
import EmployeeCard from '../components/LiveTracking/EmployeeCard';
import TrackingMap from '../components/LiveTracking/TrackingMap';
import RefreshControls from '../components/LiveTracking/RefreshControls';
import { useLocationData } from '../hooks/useLocationData';
import { Employee } from '../types/employee';

const LiveTrackingPage: React.FC = () => {
    const { employees, refreshData } = useLocationData();
    const [autoRefresh, setAutoRefresh] = useState<boolean>(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (autoRefresh) {
            interval = setInterval(() => {
                refreshData();
            }, 5000); // Refresh every 5 seconds
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRefresh, refreshData]);

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Live Employee Tracking</h1>
            <RefreshControls setAutoRefresh={setAutoRefresh} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {employees.map((employee: Employee) => (
                    <EmployeeCard key={employee.id} employee={employee} />
                ))}
            </div>
            <TrackingMap employees={employees} />
        </div>
    );
};

export default LiveTrackingPage;