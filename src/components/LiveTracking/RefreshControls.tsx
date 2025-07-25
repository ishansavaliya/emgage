import React from "react";
import { Button, Box, Typography, CircularProgress } from "@mui/material";
import { Refresh, PlayArrow, Pause, Timer } from "@mui/icons-material";

const RefreshControls: React.FC<{
  onRefresh: () => void;
  isAutoRefreshing: boolean;
  onToggleAutoRefresh: () => void;
  timeLeft: number;
}> = ({ onRefresh, isAutoRefreshing, onToggleAutoRefresh, timeLeft }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressValue = isAutoRefreshing ? ((30 - timeLeft) / 30) * 100 : 0;

  return (
    <div className="flex items-center space-x-4 flex-wrap gap-2">
      <Button
        onClick={onRefresh}
        variant="outlined"
        startIcon={<Refresh />}
        className="border-blue-500 text-blue-500 hover:bg-blue-50"
      >
        Refresh Now
      </Button>
      <Button
        onClick={onToggleAutoRefresh}
        variant={isAutoRefreshing ? "contained" : "outlined"}
        startIcon={isAutoRefreshing ? <Pause /> : <PlayArrow />}
        className={
          isAutoRefreshing
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "border-green-500 text-green-500 hover:bg-green-50"
        }
      >
        {isAutoRefreshing ? "Pause Auto Refresh" : "Start Auto Refresh"}
      </Button>

      {isAutoRefreshing && (
        <Box className="flex items-center space-x-3 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
          <Box className="relative">
            <CircularProgress
              variant="determinate"
              value={progressValue}
              size={40}
              thickness={4}
              className="text-blue-500"
            />
            <Box className="absolute inset-0 flex items-center justify-center">
              <Timer className="text-blue-600" fontSize="small" />
            </Box>
          </Box>
          <Box>
            <Typography variant="body2" className="text-blue-700 font-medium">
              Next refresh: {formatTime(timeLeft)}
            </Typography>
            <Typography variant="caption" className="text-blue-600">
              Auto-refresh active
            </Typography>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default RefreshControls;
