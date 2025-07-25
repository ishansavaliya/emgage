import React from "react";
import { Button, Typography, CircularProgress } from "@mui/material";
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
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
      {/* Compact Control Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <Typography variant="h6" className="text-gray-800 font-medium">
            Live Tracking
          </Typography>
        </div>

        {isAutoRefreshing && (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <CircularProgress
                variant="determinate"
                value={progressValue}
                size={24}
                thickness={6}
                className="text-blue-500"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Timer className="text-blue-600" sx={{ fontSize: 12 }} />
              </div>
            </div>
            <Typography variant="caption" className="text-blue-600 font-medium">
              {formatTime(timeLeft)}
            </Typography>
          </div>
        )}
      </div>

      {/* Compact Button Row */}
      <div className="flex items-center space-x-2">
        <Button
          onClick={onRefresh}
          variant="outlined"
          size="small"
          startIcon={<Refresh sx={{ fontSize: 16 }} />}
          className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-50 text-xs"
        >
          Refresh
        </Button>

        <Button
          onClick={onToggleAutoRefresh}
          variant={isAutoRefreshing ? "contained" : "outlined"}
          size="small"
          startIcon={
            isAutoRefreshing ? (
              <Pause sx={{ fontSize: 16 }} />
            ) : (
              <PlayArrow sx={{ fontSize: 16 }} />
            )
          }
          className={`flex-1 text-xs ${
            isAutoRefreshing
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "border-green-500 text-green-500 hover:bg-green-50"
          }`}
        >
          {isAutoRefreshing ? "Pause" : "Auto"}
        </Button>
      </div>
    </div>
  );
};

export default RefreshControls;
