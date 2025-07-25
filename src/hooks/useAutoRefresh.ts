import { useEffect, useRef, useState } from "react";

const useAutoRefresh = (fetchData: () => Promise<void>, interval: number) => {
  const [isActive, setIsActive] = useState(true); // Start automatically
  const [timeLeft, setTimeLeft] = useState(interval / 1000); // Timer in seconds
  const intervalRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const startAutoRefresh = () => {
    if (!isActive) {
      setIsActive(true);
      setTimeLeft(interval / 1000);
    }
  };

  const stopAutoRefresh = () => {
    if (isActive) {
      setIsActive(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  useEffect(() => {
    if (isActive) {
      // Start the data refresh interval
      intervalRef.current = setInterval(() => {
        fetchData();
        setTimeLeft(interval / 1000); // Reset timer
      }, interval);

      // Start the countdown timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            return interval / 1000; // Reset to full time
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, fetchData, interval]);

  // Auto-start on mount
  useEffect(() => {
    startAutoRefresh();
    return () => {
      stopAutoRefresh();
    };
  }, []);

  return { startAutoRefresh, stopAutoRefresh, isActive, timeLeft };
};

export default useAutoRefresh;
