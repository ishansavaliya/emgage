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
import { LocationOn, PlayArrow } from "@mui/icons-material";
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
              {employee.lastFetchTime && (
                <Typography variant="caption" className="opacity-75">
                  Last fetch:{" "}
                  {format(
                    new Date(employee.lastFetchTime),
                    "MMM dd, yyyy HH:mm:ss"
                  )}
                </Typography>
              )}
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
                    ) : (
                      <LocationOn className="text-blue-600" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <div className="flex items-center justify-between">
                        <Typography variant="body1" className="font-medium">
                          {record.action === "started" && "Started tracking"}
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

            {/* Travel Path Preview */}
            <Box className="mt-6 p-4 bg-gray-50 rounded-lg">
              <Typography variant="h6" className="mb-3 text-gray-800">
                Travel Path Overview
              </Typography>
              <div className="relative h-32 bg-white rounded border">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 400 120"
                  className="absolute inset-0"
                >
                  {(() => {
                    if (employee.history.length < 2) return null;

                    const lats = employee.history.map(
                      (h) => h.location.latitude
                    );
                    const lngs = employee.history.map(
                      (h) => h.location.longitude
                    );
                    const minLat = Math.min(...lats);
                    const maxLat = Math.max(...lats);
                    const minLng = Math.min(...lngs);
                    const maxLng = Math.max(...lngs);
                    const latRange = maxLat - minLat || 0.01;
                    const lngRange = maxLng - minLng || 0.01;

                    return (
                      <>
                        {/* Draw complete path */}
                        {employee.history.map((record, index) => {
                          if (index === 0) return null;
                          const prevRecord = employee.history[index - 1];
                          const x1 =
                            ((prevRecord.location.longitude - minLng) /
                              lngRange) *
                              360 +
                            20;
                          const y1 =
                            ((maxLat - prevRecord.location.latitude) /
                              latRange) *
                              80 +
                            20;
                          const x2 =
                            ((record.location.longitude - minLng) / lngRange) *
                              360 +
                            20;
                          const y2 =
                            ((maxLat - record.location.latitude) / latRange) *
                              80 +
                            20;

                          return (
                            <line
                              key={`path-${index}`}
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke="#ef4444"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          );
                        })}

                        {/* Start and end points */}
                        {(() => {
                          const firstPoint = employee.history[0];
                          const lastPoint =
                            employee.history[employee.history.length - 1];
                          const startX =
                            ((firstPoint.location.longitude - minLng) /
                              lngRange) *
                              360 +
                            20;
                          const startY =
                            ((maxLat - firstPoint.location.latitude) /
                              latRange) *
                              80 +
                            20;
                          const endX =
                            ((lastPoint.location.longitude - minLng) /
                              lngRange) *
                              360 +
                            20;
                          const endY =
                            ((maxLat - lastPoint.location.latitude) /
                              latRange) *
                              80 +
                            20;

                          return (
                            <>
                              <circle
                                cx={startX}
                                cy={startY}
                                r="6"
                                fill="#22c55e"
                                stroke="white"
                                strokeWidth="2"
                              />
                              <circle
                                cx={endX}
                                cy={endY}
                                r="6"
                                fill="#f59e0b"
                                stroke="white"
                                strokeWidth="2"
                              />
                            </>
                          );
                        })()}
                      </>
                    );
                  })()}
                </svg>
                <div className="absolute bottom-1 left-2 text-xs text-gray-600">
                  🟢 Start → 🔴 Path → 🟠 Current
                </div>
              </div>
            </Box>
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
