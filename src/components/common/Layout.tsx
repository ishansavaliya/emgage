import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
} from "@mui/material";
import { Dashboard, History } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppBar
        position="static"
        className="bg-gradient-to-r from-blue-600 to-purple-600"
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Live Tracking Application
          </Typography>
          <Box className="space-x-2">
            <Button
              component={Link}
              to="/"
              color="inherit"
              startIcon={<Dashboard />}
              variant={location.pathname === "/" ? "outlined" : "text"}
            >
              Live Tracking
            </Button>
            <Button
              component={Link}
              to="/history"
              color="inherit"
              startIcon={<History />}
              variant={location.pathname === "/history" ? "outlined" : "text"}
            >
              History
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <main className="flex-grow">{children}</main>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <Typography variant="body2" className="text-gray-300">
          &copy; {new Date().getFullYear()} Live Tracking App. All rights
          reserved.
        </Typography>
      </footer>
    </div>
  );
};

export default Layout;
