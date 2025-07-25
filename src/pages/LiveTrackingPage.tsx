import React from "react";
import EmployeeCard from "../components/LiveTracking/EmployeeCard";
import TrackingMap from "../components/LiveTracking/TrackingMap";
import RefreshControls from "../components/LiveTracking/RefreshControls";
import Layout from "../components/common/Layout";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useLocationData } from "../hooks/useLocationData";
import useAutoRefresh from "../hooks/useAutoRefresh";
import { Employee } from "../types/employee";
import { Typography, Container, Grid, Paper, Box } from "@mui/material";

const LiveTrackingPage: React.FC = () => {
  const { employees, loading, error, refreshData } = useLocationData();
  const { startAutoRefresh, stopAutoRefresh, isActive, timeLeft } =
    useAutoRefresh(
      refreshData,
      30000 // Auto-refresh every 30 seconds
    );

  const handleToggleAutoRefresh = () => {
    if (isActive) {
      stopAutoRefresh();
    } else {
      startAutoRefresh();
    }
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
        <Box className="mb-6">
          <Typography variant="h4" className="font-bold mb-4 text-gray-800">
            Live Employee Tracking
          </Typography>
          <RefreshControls
            onRefresh={refreshData}
            isAutoRefreshing={isActive}
            onToggleAutoRefresh={handleToggleAutoRefresh}
            timeLeft={timeLeft}
          />
        </Box>

        <Grid container spacing={3}>
          {/* Employee Cards */}
          <Grid item xs={12} lg={4}>
            <Paper elevation={2} className="p-4 h-fit">
              <Typography variant="h6" className="mb-4 font-semibold">
                Employees ({employees.length})
              </Typography>
              <div className="space-y-4">
                {employees.map((employee: Employee) => (
                  <EmployeeCard key={employee.id} employee={employee} />
                ))}
              </div>
            </Paper>
          </Grid>

          {/* Map */}
          <Grid item xs={12} lg={8}>
            <Paper elevation={2} className="h-96 lg:h-[600px]">
              <TrackingMap />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default LiveTrackingPage;
