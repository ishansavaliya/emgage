import React, { useState } from "react";
import { useLocationData } from "../hooks/useLocationData";
import HistoryPopup from "../components/History/HistoryPopup";
import TimelinePlayer from "../components/History/TimelinePlayer";
import Layout from "../components/common/Layout";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Employee } from "../types/employee";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Box,
} from "@mui/material";
import { History, Timeline } from "@mui/icons-material";

const HistoryPage: React.FC = () => {
  const { employees, loading, error } = useLocationData();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [showHistory, setShowHistory] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

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
      <div className="p-6">
        <Typography variant="h4" className="font-bold mb-6 text-gray-800">
          Employee Location History
        </Typography>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {employees.map((employee) => (
            <Card
              key={employee.id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar
                    src={employee.image}
                    alt={employee.name}
                    sx={{ width: 56, height: 56 }}
                  />
                  <div>
                    <Typography variant="h6" className="font-semibold">
                      {employee.name}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {employee.history.length} location records
                    </Typography>
                  </div>
                </div>

                <Box className="flex space-x-2">
                  <Button
                    variant="outlined"
                    startIcon={<History />}
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setShowHistory(true);
                    }}
                    size="small"
                    className="flex-1"
                  >
                    View History
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Timeline />}
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setShowTimeline(true);
                    }}
                    size="small"
                    className="flex-1"
                  >
                    Play Timeline
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* History Popup */}
        {selectedEmployee && (
          <HistoryPopup
            open={showHistory}
            onClose={() => {
              setShowHistory(false);
              setSelectedEmployee(null);
            }}
            employee={selectedEmployee}
          />
        )}

        {/* Timeline Player */}
        {selectedEmployee && (
          <TimelinePlayer
            open={showTimeline}
            onClose={() => {
              setShowTimeline(false);
              setSelectedEmployee(null);
            }}
            employee={selectedEmployee}
          />
        )}
      </div>
    </Layout>
  );
};

export default HistoryPage;
