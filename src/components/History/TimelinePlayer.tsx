import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slider,
  IconButton,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  FastForward,
  FastRewind,
  SkipNext,
  SkipPrevious,
} from "@mui/icons-material";
import { Employee } from "../../types/employee";
import { format } from "date-fns";

interface TimelinePlayerProps {
  open: boolean;
  onClose: () => void;
  employee: Employee;
}

const TimelinePlayer: React.FC<TimelinePlayerProps> = ({
  open,
  onClose,
  employee,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  const speedOptions = [0.5, 1, 2, 5, 10, 25, 50, 100];

  useEffect(() => {
    if (isPlaying && open) {
      const id = window.setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= employee.history.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
      setIntervalId(id);
    } else {
      if (intervalId) {
        window.clearInterval(intervalId);
        setIntervalId(null);
      }
    }

    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [isPlaying, speed, open, employee.history.length]);

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      setCurrentIndex(0);
      setIsPlaying(false);
      if (intervalId) {
        window.clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  }, [open]);

  const handlePlay = () => setIsPlaying(!isPlaying);
  const handleSpeedChange = () => {
    const currentSpeedIndex = speedOptions.indexOf(speed);
    const nextSpeed =
      speedOptions[(currentSpeedIndex + 1) % speedOptions.length];
    setSpeed(nextSpeed);
  };

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    setCurrentIndex(newValue as number);
    setIsPlaying(false);
  };

  const currentRecord = employee.history[currentIndex];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <Typography variant="h6">Timeline Player - {employee.name}</Typography>
      </DialogTitle>

      <DialogContent className="p-6">
        {currentRecord && (
          <Box className="space-y-6">
            {/* Current Location Info */}
            <Box className="bg-gray-50 p-4 rounded-lg">
              <Typography variant="h6" className="mb-2">
                Current Position
              </Typography>
              <Typography variant="body1" className="text-gray-700">
                {currentRecord.location.address ||
                  `Lat: ${currentRecord.location.latitude.toFixed(
                    6
                  )}, Lng: ${currentRecord.location.longitude.toFixed(6)}`}
              </Typography>
              <Typography variant="body2" className="text-gray-600 mt-1">
                {format(
                  new Date(currentRecord.timestamp),
                  "MMM dd, yyyy HH:mm:ss"
                )}
              </Typography>
              {currentRecord.speed && (
                <Chip
                  label={`Speed: ${currentRecord.speed.toFixed(1)} km/h`}
                  size="small"
                  className="mt-2"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>

            {/* Timeline Slider */}
            <Box className="px-4">
              <Typography variant="body2" className="mb-2">
                Timeline Progress: {currentIndex + 1} /{" "}
                {employee.history.length}
              </Typography>
              <Slider
                value={currentIndex}
                min={0}
                max={employee.history.length - 1}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) =>
                  format(new Date(employee.history[value]?.timestamp), "HH:mm")
                }
                className="text-blue-600"
              />
            </Box>

            {/* Player Controls */}
            <Box className="flex items-center justify-center space-x-4 bg-gray-50 p-4 rounded-lg">
              <IconButton
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
              >
                <SkipPrevious />
              </IconButton>

              <IconButton
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 5))}
              >
                <FastRewind />
              </IconButton>

              <IconButton
                onClick={handlePlay}
                className="bg-blue-600 text-white hover:bg-blue-700"
                size="large"
              >
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>

              <IconButton
                onClick={() =>
                  setCurrentIndex(
                    Math.min(employee.history.length - 1, currentIndex + 5)
                  )
                }
              >
                <FastForward />
              </IconButton>

              <IconButton
                onClick={() =>
                  setCurrentIndex(
                    Math.min(employee.history.length - 1, currentIndex + 1)
                  )
                }
                disabled={currentIndex === employee.history.length - 1}
              >
                <SkipNext />
              </IconButton>

              <Button
                onClick={handleSpeedChange}
                variant="outlined"
                size="small"
                className="ml-4"
              >
                {speed}x
              </Button>
            </Box>

            {/* Travel Path Visualization */}
            <Box className="h-80 bg-gray-100 rounded-lg p-4">
              <Typography variant="h6" className="mb-2">
                Travel Path - Red Line from Last to First Location
              </Typography>
              <div className="relative h-64 bg-white rounded border overflow-hidden">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 400 250"
                  className="absolute inset-0"
                >
                  {/* Calculate bounds for better visualization */}
                  {(() => {
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
                        {/* Draw complete path lines */}
                        {employee.history.map((record, index) => {
                          if (index === 0) return null;
                          const prevRecord = employee.history[index - 1];

                          // Normalize coordinates to fit in the SVG viewport with padding
                          const x1 =
                            ((prevRecord.location.longitude - minLng) /
                              lngRange) *
                              360 +
                            20;
                          const y1 =
                            ((maxLat - prevRecord.location.latitude) /
                              latRange) *
                              210 +
                            20;
                          const x2 =
                            ((record.location.longitude - minLng) / lngRange) *
                              360 +
                            20;
                          const y2 =
                            ((maxLat - record.location.latitude) / latRange) *
                              210 +
                            20;

                          return (
                            <line
                              key={`line-${index}`}
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke="#ef4444"
                              strokeWidth="3"
                              opacity={index <= currentIndex ? 1 : 0.3}
                              strokeLinecap="round"
                            />
                          );
                        })}

                        {/* Draw location points */}
                        {employee.history.map((record, index) => {
                          const x =
                            ((record.location.longitude - minLng) / lngRange) *
                              360 +
                            20;
                          const y =
                            ((maxLat - record.location.latitude) / latRange) *
                              210 +
                            20;

                          return (
                            <circle
                              key={`point-${index}`}
                              cx={x}
                              cy={y}
                              r={index === currentIndex ? 10 : 5}
                              fill={
                                index === currentIndex
                                  ? "#2563eb"
                                  : index === 0
                                  ? "#22c55e"
                                  : index === employee.history.length - 1
                                  ? "#f59e0b"
                                  : "#ef4444"
                              }
                              stroke="white"
                              strokeWidth="2"
                              opacity={index <= currentIndex ? 1 : 0.5}
                            />
                          );
                        })}

                        {/* Add labels for start and end */}
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
                              210 +
                            20;
                          const endX =
                            ((lastPoint.location.longitude - minLng) /
                              lngRange) *
                              360 +
                            20;
                          const endY =
                            ((maxLat - lastPoint.location.latitude) /
                              latRange) *
                              210 +
                            20;

                          return (
                            <>
                              <text
                                x={startX}
                                y={startY - 15}
                                textAnchor="middle"
                                fontSize="10"
                                fill="#22c55e"
                                fontWeight="bold"
                              >
                                START
                              </text>
                              <text
                                x={endX}
                                y={endY - 15}
                                textAnchor="middle"
                                fontSize="10"
                                fill="#f59e0b"
                                fontWeight="bold"
                              >
                                END
                              </text>
                            </>
                          );
                        })()}
                      </>
                    );
                  })()}
                </svg>
                <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs shadow">
                  🔴 Red line: Travel path | 🔵 Blue: Current | 🟢 Green: Start
                  | 🟠 Orange: End
                </div>
                <div className="absolute top-2 right-2 bg-blue-50 px-2 py-1 rounded text-xs">
                  Step {currentIndex + 1} of {employee.history.length}
                </div>
              </div>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions className="p-4">
        <Button onClick={onClose} variant="outlined">
          Close Player
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TimelinePlayer;
