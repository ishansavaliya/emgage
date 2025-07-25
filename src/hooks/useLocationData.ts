import { useEffect, useState, useCallback } from "react";
import { Employee } from "../types/employee";
import { getEmployees } from "../services/mockData";

export const useLocationData = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError("Failed to fetch employee data");
      console.error("Error fetching employee data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    employees,
    loading,
    error,
    refreshData,
  };
};
