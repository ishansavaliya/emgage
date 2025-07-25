import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Box,
} from "@mui/material";
import { LocationOn, PlayArrow, Stop, History } from "@mui/icons-material";
import { Employee } from "../../types/employee";
import TimelinePlayer from "./TimelinePlayer";
import { format } from "date-fns";

interface HistoryPopupProps {
  open: boolean;
  onClose: () => void;
  employee: Employee;
}

const HistoryPopup: React.FC<HistoryPopupProps> = ({
  open,
  onClose,
  employee,
}) => {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        className="backdrop-blur-sm"
      >
        <DialogTitle className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center space-x-3">
            <Avatar src={employee.image} alt={employee.name} />
            <div>
              <Typography variant="h6">{employee.name}</Typography>
              <Typography variant="body2" className="opacity-90">
                Location History
              </Typography>
            </div>
          </div>
        </DialogTitle>

        <DialogContent className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" className="text-gray-800">
                Recent Activity
              </Typography>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => setShowPlayer(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Play Timeline
              </Button>
            </div>

            <List className="max-h-60 overflow-y-auto">
              {employee.history.map((record) => (
                <ListItem
                  key={record.id}
                  className="hover:bg-gray-50 rounded-lg mb-2 border border-gray-100"
                >
                  <ListItemIcon>
                    {record.action === "started" ? (
                      <PlayArrow className="text-green-600" />
                    ) : record.action === "stopped" ? (
                      <Stop className="text-red-600" />
                    ) : (
                      <LocationOn className="text-blue-600" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <div className="flex items-center justify-between">
                        <Typography variant="body1" className="font-medium">
                          {record.action === "started" && "Started tracking"}
                          {record.action === "stopped" && "Stopped tracking"}
                          {record.action === "moved" && "Location update"}
                        </Typography>
                        <Chip
                          label={format(new Date(record.timestamp), "HH:mm")}
                          size="small"
                          variant="outlined"
                        />
                      </div>
                    }
                    secondary={
                      <Box className="mt-1">
                        <Typography variant="body2" className="text-gray-600">
                          {record.location.address ||
                            `${record.location.latitude.toFixed(
                              4
                            )}, ${record.location.longitude.toFixed(4)}`}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          {format(
                            new Date(record.timestamp),
                            "MMM dd, yyyy HH:mm:ss"
                          )}
                          {record.speed &&
                            ` • Speed: ${record.speed.toFixed(1)} km/h`}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </div>
        </DialogContent>

        <DialogActions className="p-4 bg-gray-50">
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <TimelinePlayer
        open={showPlayer}
        onClose={() => setShowPlayer(false)}
        employee={employee}
      />
    </>
  );
};

export default HistoryPopup;
