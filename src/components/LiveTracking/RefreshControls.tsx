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
    <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-3 text-white">
      {/* Compact Control Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <Typography variant="body2" className="text-white font-medium">
            Live Tracking
          </Typography>
        </div>

        {isAutoRefreshing && (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <CircularProgress
                variant="determinate"
                value={progressValue}
                size={20}
                thickness={6}
                sx={{ color: "white" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Timer sx={{ fontSize: 10, color: "white" }} />
              </div>
            </div>
            <Typography
              variant="caption"
              className="text-white font-medium text-xs"
            >
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
          startIcon={<Refresh sx={{ fontSize: 14 }} />}
          sx={{
            borderColor: "white",
            color: "white",
            fontSize: "0.7rem",
            "&:hover": {
              borderColor: "white",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
          className="flex-1"
        >
          Refresh
        </Button>

        <Button
          onClick={onToggleAutoRefresh}
          variant={isAutoRefreshing ? "contained" : "outlined"}
          size="small"
          startIcon={
            isAutoRefreshing ? (
              <Pause sx={{ fontSize: 14 }} />
            ) : (
              <PlayArrow sx={{ fontSize: 14 }} />
            )
          }
          sx={{
            fontSize: "0.7rem",
            ...(isAutoRefreshing
              ? {
                  backgroundColor: "#ef4444",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#dc2626",
                  },
                }
              : {
                  borderColor: "#22c55e",
                  color: "#22c55e",
                  "&:hover": {
                    borderColor: "#22c55e",
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                  },
                }),
          }}
          className="flex-1"
        >
          {isAutoRefreshing ? "Pause" : "Auto"}
        </Button>
      </div>
    </div>
  );
};

export default RefreshControls;
