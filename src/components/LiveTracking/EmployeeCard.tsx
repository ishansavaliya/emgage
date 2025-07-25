import React, { useState } from "react";
import { Card, CardContent, Avatar, Typography, Chip } from "@mui/material";
import { LocationOn, GpsFixed } from "@mui/icons-material";
import { Employee } from "../../types/employee";
import { format } from "date-fns";

interface EmployeeCardProps {
  employee: Employee;
  onSelect?: (employee: Employee) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onSelect }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(employee);
      // Visual feedback for user that this employee is now focused
      setIsFocused(true);
      // Reset the focus after a short delay for visual feedback
      setTimeout(() => setIsFocused(false), 1000);
    }
  };

  return (
    <>
      <Card
        className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${
          isFocused ? "ring-2 ring-blue-500 shadow-lg bg-blue-50" : ""
        }`}
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar
              src={employee.image}
              alt={employee.name}
              sx={{ width: 64, height: 64 }}
            />
            <div className="flex-1">
              <Typography variant="h6" className="font-semibold">
                {employee.name}
              </Typography>
              <div className="flex items-center space-x-1 text-gray-600 mt-1">
                <LocationOn fontSize="small" />
                <Typography variant="body2">
                  {employee.currentLocation.address ||
                    `${employee.currentLocation.latitude.toFixed(
                      4
                    )}, ${employee.currentLocation.longitude.toFixed(4)}`}
                </Typography>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex flex-col space-y-1">
                  {/* <Chip
                    icon={<GpsFixed />}
                    label="Always Active"
                    color="success"
                    size="small"
                  /> */}
                  {employee.lastFetchTime && (
                    <Typography variant="caption" className="text-gray-500">
                      Last update:{" "}
                      {format(new Date(employee.lastFetchTime), "HH:mm:ss")}
                    </Typography>
                  )}
                </div>
                {/* <div className="text-sm text-gray-600 mt-2">
                  <Typography variant="body2">
                    📍 Click on map marker for details and timeline
                  </Typography>
                </div> */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default EmployeeCard;
