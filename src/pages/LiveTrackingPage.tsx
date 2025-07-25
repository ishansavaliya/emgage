import React from "react";
import EmployeeCard from "../components/LiveTracking/EmployeeCard";
import TrackingMap from "../components/LiveTracking/TrackingMap";
import RefreshControls from "../components/LiveTracking/RefreshControls";
import Layout from "../components/common/Layout";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useLocationData } from "../hooks/useLocationData";
import useAutoRefresh from "../hooks/useAutoRefresh";
import { Employee } from "../types/employee";
import { Typography, Container, Grid, Paper } from "@mui/material";

const LiveTrackingPage: React.FC = () => {
  const { employees, loading, error, refreshData } = useLocationData();
  const { startAutoRefresh, stopAutoRefresh, isActive, timeLeft } =
    useAutoRefresh(
      refreshData,
      30000 // Auto-refresh every 30 seconds to match the mock data updates
    );
  const [focusEmployeeId, setFocusEmployeeId] = React.useState<
    string | undefined
  >(undefined);

  const handleToggleAutoRefresh = () => {
    if (isActive) {
      stopAutoRefresh();
    } else {
      startAutoRefresh();
    }
  };

  const handleEmployeeSelect = (employee: Employee) => {
    setFocusEmployeeId(employee.id);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-600 p-4">
          <Typography variant="h6">Error: {error}</Typography>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="xl" className="py-6">
        <Grid container spacing={3}>
          {/* Header with Controls */}
          <Grid item xs={12}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <Typography variant="h4" className="font-bold text-gray-800">
                Live Employee Tracking
              </Typography>
              <div className="lg:w-80">
                <RefreshControls
                  onRefresh={refreshData}
                  isAutoRefreshing={isActive}
                  onToggleAutoRefresh={handleToggleAutoRefresh}
                  timeLeft={timeLeft}
                />
              </div>
            </div>
          </Grid>

          {/* Employee Cards */}
          <Grid item xs={12} lg={4}>
            <Paper elevation={2} className="p-4 h-fit">
              <Typography variant="h6" className="mb-4 font-semibold">
                Employees ({employees.length})
              </Typography>
              <div className="space-y-4">
                {employees.map((employee: Employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    onSelect={handleEmployeeSelect}
                  />
                ))}
              </div>
            </Paper>
          </Grid>

          {/* Map */}
          <Grid item xs={12} lg={8}>
            <Paper elevation={2} className="h-96 lg:h-[600px]">
              <TrackingMap focusEmployeeId={focusEmployeeId} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default LiveTrackingPage;
