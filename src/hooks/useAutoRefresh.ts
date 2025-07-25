import { useEffect, useRef, useState } from 'react';

const useAutoRefresh = (fetchData: () => Promise<void>, interval: number) => {
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startAutoRefresh = () => {
        if (!isActive) {
            setIsActive(true);
            intervalRef.current = setInterval(() => {
                fetchData();
            }, interval);
        }
    };

    const stopAutoRefresh = () => {
        if (isActive) {
            setIsActive(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    };

    useEffect(() => {
        return () => {
            stopAutoRefresh();
        };
    }, []);

    return { startAutoRefresh, stopAutoRefresh, isActive };
};

export default useAutoRefresh;