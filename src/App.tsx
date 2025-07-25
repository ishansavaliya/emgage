import React from "react";
import AppRouter from "./router/AppRouter";
import "./styles/globals.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
};

export default App;
