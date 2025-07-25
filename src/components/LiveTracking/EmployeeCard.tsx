import React, { useState } from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import { History, LocationOn, PlayArrow, Stop } from "@mui/icons-material";
import { Employee } from "../../types/employee";
import HistoryPopup from "../History/HistoryPopup";

interface EmployeeCardProps {
  employee: Employee;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
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
                <Chip
                  icon={employee.isActive ? <PlayArrow /> : <Stop />}
                  label={employee.isActive ? "Active" : "Inactive"}
                  color={employee.isActive ? "success" : "default"}
                  size="small"
                />
                <IconButton
                  onClick={() => setShowHistory(true)}
                  size="small"
                  className="text-blue-600"
                >
                  <History />
                </IconButton>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <HistoryPopup
        open={showHistory}
        onClose={() => setShowHistory(false)}
        employee={employee}
      />
    </>
  );
};

export default EmployeeCard;
