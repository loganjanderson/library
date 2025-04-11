import React from "react";
import { Routes, Route } from "react-router-dom";
import Scanner from "./components/scanner";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Scanner />} />
        {/* Add other routes here */}
      </Routes>
    </div>
  );
};

export default App;
