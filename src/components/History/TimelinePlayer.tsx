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
      const id = setInterval(() => {
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
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, speed, open, employee.history.length, intervalId]);

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
            <Box className="h-64 bg-gray-100 rounded-lg p-4">
              <Typography variant="h6" className="mb-2">
                Travel Path
              </Typography>
              <div className="relative h-48 bg-white rounded border">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 400 200"
                  className="absolute inset-0"
                >
                  {/* Draw path lines */}
                  {employee.history
                    .slice(0, currentIndex + 1)
                    .map((record, index) => {
                      if (index === 0) return null;
                      const prevRecord = employee.history[index - 1];

                      // Normalize coordinates to fit in the SVG viewport
                      const x1 =
                        ((prevRecord.location.longitude + 180) / 360) * 400;
                      const y1 =
                        ((90 - prevRecord.location.latitude) / 180) * 200;
                      const x2 =
                        ((record.location.longitude + 180) / 360) * 400;
                      const y2 = ((90 - record.location.latitude) / 180) * 200;

                      return (
                        <line
                          key={`line-${index}`}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#ef4444"
                          strokeWidth="2"
                          opacity={index <= currentIndex ? 1 : 0.3}
                        />
                      );
                    })}

                  {/* Draw location points */}
                  {employee.history
                    .slice(0, currentIndex + 1)
                    .map((record, index) => {
                      const x = ((record.location.longitude + 180) / 360) * 400;
                      const y = ((90 - record.location.latitude) / 180) * 200;

                      return (
                        <circle
                          key={`point-${index}`}
                          cx={x}
                          cy={y}
                          r={index === currentIndex ? 8 : 4}
                          fill={index === currentIndex ? "#2563eb" : "#ef4444"}
                          stroke="white"
                          strokeWidth="2"
                        />
                      );
                    })}
                </svg>
                <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-sm">
                  Red line shows travel path
                </div>
                <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded text-sm">
                  Blue dot: Current position
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
